package  com.boatsoft.common;

import java.sql.ResultSet;

import org.json.JSONArray;
import org.json.JSONObject;


public class MResult {

	public enum ActionResultStatus {
		NONE, SUCCESS, FAULT, ERROR;
    }
	public enum OutputType {
		JSON,XML,STRING ;
    }
	private String _error_message="";
	private ActionResultStatus _status=ActionResultStatus.NONE;
	private OutputType _type=OutputType.JSON;
	private JSONObject _json=null;
	private int _added_id=0;
	private JSONArray fill_rs=null;
	public Object tag=null;
	public String getErrorMessage() {
		return _error_message;
	}
	public void setErrorMessage(String value) {
		this._error_message = value;
	}
	public ActionResultStatus getStatus() {
		return _status;
	}
	
	public void setStatus(ActionResultStatus value) {
		this._status = value;
	}
	public void setOutputType(OutputType type){
		this._type=type;
	}
	public OutputType getOutputType(){
		return _type;
	}
	public JSONObject getJson() {
		return _json;
	}
	public void setJson(JSONObject value) {
		this._json = value;
	}
	public int getAddedId() {
		return _added_id;
	}
	public void setAddedId(int value) {
		this._added_id = value;
	}
	public JSONArray getFillRS(){
		return this.fill_rs;
	}
	public void setFillRS(JSONArray value){
		this.fill_rs=value;
	}
	
	
}
