/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ada;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import util.Configuration;

/**
 *
 * @author rajin
 */
@WebServlet(urlPatterns = {"/DataServlet"})
public class DataServlet extends HttpServlet {

    public static final String METHOD_GET_ELEMENT_PROPERTIES ="getElementProperties";
    public static final String METHOD_GET_ALL_PROPERTIES ="getAllProperties";
    public static final String METHOD_ADD_NEW_PROPERTY ="addNewProperty";
    public static final String METHOD_ADD_NEW_PROPERTY_VALUE ="addNewPropertyValue";
    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
             
            String jsonData="";
            String method = request.getParameter("method");
            ADAMySql db = Configuration.getDB();
            if(method.equalsIgnoreCase(METHOD_GET_ALL_PROPERTIES))
            {
                JSONObject json = db.getJSONData("SELECT id, property_name FROM additional_properties;");
                jsonData = json.toJSONString();
            }
            else if(method.equalsIgnoreCase(METHOD_GET_ELEMENT_PROPERTIES))
            {
                String id = request.getParameter("id");
                JSONObject json = db.getJSONData("SELECT V.element_id, V.property_id, P.property_name , V.property_value "+
                                            " FROM additional_property_values AS V " +
                                            " INNER JOIN additional_properties AS P ON P.id = V.property_id " +
                                            " WHERE FIND_IN_SET( V.element_id, '"+id+"');");
                jsonData = json.toJSONString();
            }
            else if(method.equalsIgnoreCase(METHOD_ADD_NEW_PROPERTY))
            {
                String propertyName = request.getParameter("propertyName");
                String command = "INSERT INTO additional_properties(property_name) VALUES ('"+propertyName+"');";
                boolean result = db.execute(command);
                JSONObject obj = new JSONObject();
                obj.put("result", result?"Success":"Fail");
                jsonData = obj.toJSONString();
            }
            else if(method.equalsIgnoreCase(METHOD_ADD_NEW_PROPERTY_VALUE))
            {
                String propertyId = request.getParameter("propertyId");
                String propertyValue = request.getParameter("propertyValue");
                String elementIdsParam = request.getParameter("elementIds");
                String[] ids = elementIdsParam.split(",");
                String valueString ="";
                for(String id: ids)
                {
                    valueString+= "( "+propertyId+", '"+id+"', '"+propertyValue+"'),";
                }
                valueString = valueString.substring(0,valueString.length()-1);
                
                String command = "INSERT INTO additional_property_values(property_id, element_id,property_value)\n" +
                                    "VALUES  "+valueString+";";
                System.out.println(command);
                boolean result = db.execute(command);
                JSONObject obj = new JSONObject();
                obj.put("result", result?"Success":"Fail");
                jsonData = obj.toJSONString();
            }
            out.println(jsonData);
        }
        catch(Exception ex)
        {
             JSONObject exceptionObject = new JSONObject();
            
            exceptionObject.put("ExceptionMessage",ex.getMessage()+" ("+ex.getClass().toString()+")");
                    
            JSONArray stackArray = new JSONArray();
            StackTraceElement[] stackTrace = ex.getStackTrace();
            for(StackTraceElement elem: stackTrace)
            {
                stackArray.add(elem.toString());
            }
            exceptionObject.put("StackTrace", stackArray);
            
            JSONArray parameters = new JSONArray();
            Enumeration<String> names = request.getParameterNames();
            while(names.hasMoreElements())
            {
                 String n = names.nextElement();
                 JSONObject paramObj = new JSONObject();
                 paramObj.put(n, request.getParameter(n));
                 
                 parameters.add(paramObj);
            }
            exceptionObject.put("Parameters",parameters);
            
            out.println(exceptionObject);
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
