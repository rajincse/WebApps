/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ada;

import db.mysql.DatabaseHelper;

/**
 *
 * @author rajin
 */
public class ADAMySql extends DatabaseHelper{
    public static final String CLASSPATH ="com.mysql.jdbc.Driver";
    public ADAMySql(String host, String port, String databaseName, String userName, String password) {
        super( "jdbc:mysql://"+host+":"+port+"/"+databaseName, CLASSPATH, userName, password);
    }
    
}
