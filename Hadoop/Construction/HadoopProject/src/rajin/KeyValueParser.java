package rajin;

import java.util.HashMap;

import org.json.simple.JSONObject;

public class KeyValueParser {
	public static final String KEY_NAME ="name";
	public static HashMap<String, String> getKeyValues(String line, String delimiter)
	{
		HashMap< String , String> map = new HashMap< String, String> ();
		String keyValuePairs[] = line.split(delimiter);
		for(String keyValuePair: keyValuePairs)
		{
			String keyValueSplit[] = keyValuePair.split("=");
			
			if(keyValueSplit.length == 2)
			{
				String key = keyValueSplit[0].trim();
				String value = keyValueSplit[1].trim();
				map.put(key, value);
			}
			else if(keyValueSplit.length==1)
			{
				map.put(KEY_NAME, keyValueSplit[0].trim());
			}
			else
			{
				System.err.println("Error for :"+keyValuePair+"( "+line+", "+delimiter+")");
			}
			
		}
		
		return map;
	}
	
	public static String getJSONString(String line, String delimiter)
	{
		HashMap< String , String> map = getKeyValues(line, delimiter);

		JSONObject object = new JSONObject(map);
		return object.toJSONString();
	}
	
	public static void main(String[] args)
	{
		String line ="Worker Ham 2 || visible=false || rotationSpeed=4.08675332809664 || translationSpeed=0.0166340970193241 || cameraDistance=49.21244";
		
		String timeRegEx = "T=\\d.\\d.*";
		if(line.matches(timeRegEx))
		{
			System.out.println("Match!");
		}
		else
		{
			System.out.println("No Match!");
		}
		
		String delimiter = "\\|\\|";
		System.out.println("json: "+getJSONString(line, delimiter));
	}
}
