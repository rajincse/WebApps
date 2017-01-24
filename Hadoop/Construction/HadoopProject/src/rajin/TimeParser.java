package rajin;

import java.io.IOException;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;



public class TimeParser {
	public static final String REGEX_NUMBER = "\\d+.\\d+";
	
	public static double getTimeStamp(String s)
	{	
		Pattern p = Pattern.compile(REGEX_NUMBER);
		Matcher m = p.matcher(s) ;
		
		double result =-1;
		if(m.find())
		{
			result = Double.parseDouble( m.group());
		}
		
		return result;
	}
public static class Map extends Mapper<Object, Text, DoubleWritable, Text> {
		private String lastTimestampLine="";
		
		private Text word = new Text();
		
	  @Override
		protected void map(Object key, Text value, Mapper<Object, Text, DoubleWritable, Text>.Context context)
				throws IOException, InterruptedException {
			// TODO Auto-generated method stub
		  String line = value.toString();
		  
		  if(VisibleObjectsParser.isNewTimeStampLine(line))
		  {
			  lastTimestampLine = line;
			  double timeStamp = getTimeStamp(lastTimestampLine);
			  word.set(lastTimestampLine);
			  context.write(new DoubleWritable(timeStamp), word);			  
		  }
		  
		}
	}
	
	public static class Reduce
    extends Reducer<DoubleWritable, Text, DoubleWritable, Text> {
		@Override
		protected void reduce(DoubleWritable key, Iterable<Text> values,
				Reducer<DoubleWritable, Text, DoubleWritable, Text>.Context context) throws IOException, InterruptedException {
		
			
			context.write(key,values.iterator().next());
		}
	}
	
	public static void main(String[] args) throws Exception{
        Configuration conf = new Configuration();
        

        Job job = new Job(conf, "TimeParser");
        job.setOutputKeyClass(DoubleWritable.class);
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
