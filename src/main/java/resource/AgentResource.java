package resource;

import model.Agent;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/agents")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AgentResource {

    @GET
    public List<Agent> getAllAgents() {
        return Agent.listAll();
    }

    @POST
    @Transactional
    public Agent createAgent(Agent agent) {
        agent.persist();
        return agent;
    }
}