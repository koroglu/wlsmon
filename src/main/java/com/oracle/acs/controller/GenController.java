package com.oracle.acs.controller;

import java.util.Base64;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.json.Json;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response;

import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.oss.driver.api.core.cql.Row;
import com.oracle.acs.dao.CassandraDAO;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

@Path("/gen")
@Singleton
public class GenController {

	@Inject
	private CassandraDAO cassandraDAO;

	@GET
	@Path("/listDomains")
	public String listDomains() {
		ResultSet rst = cassandraDAO.getSession().execute("select * from wls.monitoring_domains");
		StringBuilder strb = new StringBuilder();
		JsonArray jsonArr = new JsonArray();
		List<Row> all = rst.all();
		for (Row row : all) {
			strb.append(row.get("domainName", String.class));
			JsonObject jsonObject = new JsonObject();
			jsonObject.put("domain_id", row.getInt("domain_id"));
			jsonObject.put("domainName", row.getString("domainName"));
			jsonObject.put("userName", row.getString("userName"));
			jsonObject.put("password", row.getString("password"));
			jsonObject.put("url", row.getString("url"));
			jsonObject.put("created_time", row.getObject("created_time"));
			jsonArr.add(jsonObject);
		}
		return jsonArr.toString();
	}

	@GET
	@Path("/listTree")
	public String getTree(@QueryParam("nodeId") Integer nodeId) {
		System.out.println("#####" + nodeId);
		ResultSet rst = cassandraDAO.getSession().execute("select * from wls.menu_nodes where parentNodeId=" + nodeId + " ALLOW FILTERING ");

		JsonArray jsonArr = new JsonArray();
		List<Row> all = rst.all();
		for (Row row : all) {
			JsonObject jsonObject = new JsonObject();
			jsonObject.put("nodeId", row.getInt("nodeId"));
			jsonObject.put("parentNodeId", row.getInt("parentNodeId"));
			jsonObject.put("nodeName", row.getString("nodeName"));
			jsonObject.put("url", row.getString("url"));
			jsonObject.put("leaf", true);
			jsonArr.add(jsonObject);
		}
		JsonObject jsonObject = new JsonObject();
		jsonObject.put("data", jsonArr);
		return jsonObject.toString();
	}

	@GET
	@Path("/listDomainsServerStatus")
	public String listDomainsServerStatus() {

		StringBuilder strb = new StringBuilder();
		JsonObject jsonFinal = new JsonObject();
		JsonArray jArrFinal = new JsonArray();

		List<Row> listWlsDomains = listWlsDomains();
		for (Row row : listWlsDomains) {
			try {
				WebTarget target = ClientBuilder.newClient().target("http://"+row.getString("url")+"/management/tenant-monitoring/servers");
				Invocation buildGet = target.request().header("authorization", lookupAuth(row.getString("username"),row.getString("password"))).header("Accept", "application/json").buildGet();
				Response response = buildGet.invoke();
				String readEntity = response.readEntity(String.class);
				
				JsonObject jObj = new JsonObject(readEntity);
				JsonArray jArr = jObj.getJsonObject("body").getJsonArray("items");
				for (Object object : jArr) {
					((JsonObject)object).put("domainName",row.getString("domainName"));
					jArrFinal.add(object);
				}
				
			} catch (Exception e) {
				e.printStackTrace();
			} 
			
		}
		jsonFinal.put("list", jArrFinal);
		return jsonFinal.toString();
	}

	public List<Row> listWlsDomains() {
		ResultSet rst = cassandraDAO.getSession().execute("select * from wls.monitoring_domains");
		List<Row> all = rst.all();
		return all;
	}

	@GET
	@Path("/listWebLogicDomains")
	public String getWebLogicDomains() {
		StringBuilder strb = new StringBuilder();
		List<Row> all = listWlsDomains();
		JsonArray jsonArr = new JsonArray();

		for (Row row : all) {
			strb.append(row.get("domainName", String.class));
			JsonObject jsonObject = new JsonObject();
			jsonObject.put("domain_id", row.getInt("domain_id"));
			jsonObject.put("domainName", row.getString("domainName"));
			jsonObject.put("userName", row.getString("userName"));
			jsonObject.put("password", row.getString("password"));
			jsonObject.put("url", row.getString("url"));
			jsonObject.put("created_time", row.getObject("created_time"));
			jsonArr.add(jsonObject);
		}

		/*
		 * return Json .createObjectBuilder() .add("list",
		 * this.userDatabase.getOrDefault(userId, "Default User")) .build();
		 * https://rieckpil.de/howto-microprofile-rest-client-for-restful-communication/
		 */

		JsonObject jsonObject = new JsonObject();
		jsonObject.put("record", jsonArr);
		return jsonObject.toString();
		// return jsonArr.toString() + "page=" + readEntity;
	}

	private String lookupAuth(String username, String password) {
		String birlestir = (username + ":" + password);
		return "Basic " + Base64.getEncoder().encodeToString(birlestir.getBytes());
	}

	@GET
	@Path("/test")
	public String test() {

		return "selam";
	}

	@POST
	@Path("/insertNewDomain")
	public String insertNewDomain() {
		ResultSet rst = cassandraDAO.getSession().execute("select * from wls.monitoring_domains");
		StringBuilder strb = new StringBuilder();
		List<Row> all = rst.all();
		for (Row row : all) {
			strb.append(row.get("domainName", String.class));

		}

		return strb.toString();
	}

}
