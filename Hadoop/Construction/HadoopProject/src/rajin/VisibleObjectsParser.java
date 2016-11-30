package rajin;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;


public class VisibleObjectsParser {
	public static final String TIME_REGEX ="T=\\d.\\d.*";
	public static final String DELIMITER ="\\|\\|";
	public static final String KEY_VISIBLE="visible";
	public static final String KEY_VIEWED="viewed";
	public static boolean isNewTimeStampLine(String line)
	{
		return line.matches(TIME_REGEX);
		
	}
	
	public static class  Event implements Comparable<Event> 
	{
		private JSONObject object = null;

		public Event(String line)
		{
			
			this.object = new JSONObject(KeyValueParser.getKeyValues(line, DELIMITER));
			
		}
		
		public JSONObject getObject()
		{
			return this.object;
		}
		@Override
		public int compareTo(Event o) {
			if(object != null && o.getObject() != null)
			{
				double viewingTime1 = Double.parseDouble((String)object.get(KEY_VIEWED));
				double viewingTime2 = Double.parseDouble((String)o.getObject().get(KEY_VIEWED));
				return Double.compare(viewingTime1, viewingTime2);
			}
			else
			{
				return 0;
			}
			
		}
		
	}
	
	public static class Map extends Mapper<Object, Text, Text, Text> {
		private String lastTimestampLine="";
		
		private Text word = new Text();
		
	  @Override
		protected void map(Object key, Text value, Mapper<Object, Text, Text, Text>.Context context)
				throws IOException, InterruptedException {
			// TODO Auto-generated method stub
		  String line = value.toString();
		  if(isNewTimeStampLine(line))
		  {
			  lastTimestampLine= line;
		  }
		  else
		  {
			  HashMap<String, String>map =KeyValueParser.getKeyValues(line, DELIMITER);
			  if(map.containsKey(KEY_VISIBLE) && map.get(KEY_VISIBLE).equals("true"))
			  {
				  word.set(lastTimestampLine);
				  context.write(word, new Text(line));
			  }
		  }
		}
	}
	
	public static class Reduce
    extends Reducer<Text, Text, Text, Text> {
		@Override
		protected void reduce(Text key, Iterable<Text> values,
				Reducer<Text, Text, Text, Text>.Context context) throws IOException, InterruptedException {
			ArrayList<Event> list = new ArrayList<Event>();
			for(Text t: values)
			{
				String jsonString = t.toString();
				Event e = new Event(jsonString);
				list.add(e);
			}
			Collections.sort(list);
			JSONArray array = new JSONArray();
			for(Event e: list)
			{
				array.add(e.getObject()); 
			}
			String json = array.toJSONString();
			context.write(key, new Text(json));
			
		}
	}
	
	public static void main(String[] args) throws Exception{
        Configuration conf = new Configuration();

        Job job = new Job(conf, "VisibleObjectsParser");
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);

        job.setMapperClass(Map.class);
        job.setReducerClass(Reduce.class);

        job.setInputFormatClass(TextInputFormat.class);
        job.setOutputFormatClass(TextOutputFormat.class);

        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));

        job.waitForCompletion(true);

    }
}
