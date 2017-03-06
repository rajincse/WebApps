package rajin;

import org.apache.hadoop.io.BinaryComparable;
import org.apache.hadoop.io.Text;

public class TimeKeyTextWritable extends Text{

	@Override
	public int compareTo(BinaryComparable other) {
		// TODO Auto-generated method stub
		if( other instanceof TimeKeyTextWritable)
		{
			TimeKeyTextWritable text = ((TimeKeyTextWritable)other);
			String otherKey = text.toString();
			String current = this.toString();
			if(
					VisibleObjectsParser.isNewTimeStampLine(otherKey)
					&& 
					VisibleObjectsParser.isNewTimeStampLine(current)
			)
			{
				double otherTimeStamp = TimeParser.getTimeStamp(otherKey);
				double currentTimeStamp = TimeParser.getTimeStamp(current);
				
				return Double.compare(currentTimeStamp, otherTimeStamp);
			}
		}
		return super.compareTo(other);
	}
}
