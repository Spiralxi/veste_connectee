package resource;

import model.Capteur;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/capteurs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CapteurResource {

    @GET
    public List<Capteur> getAllCapteurs() {
        return Capteur.listAll();
    }

    @POST
    @Transactional
    public Capteur createCapteur(Capteur capteur) {
        capteur.persist();
        return capteur;
    }
}
