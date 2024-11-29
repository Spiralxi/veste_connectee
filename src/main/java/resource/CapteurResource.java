package resource;

import model.Capteur;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@Path("/capteurs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CapteurResource {

    @Inject
    CapteurWebSocket capteurWebSocket;

    @GET
    public List<Capteur> getAllCapteurs() {
        return Capteur.listAll();
    }

    @POST
    @Transactional
    public Capteur createCapteur(Capteur capteur) {
        capteur.persist();
        try {
            // Créer une map pour les données du capteur
            Map<String, Object> capteurData = new HashMap<>();
            capteurData.put("type", capteur.type);
            capteurData.put("emplacement", capteur.emplacement);
            capteurData.put("valeur", capteur.valeur);

            // Convertir la map en chaîne JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonMessage = objectMapper.writeValueAsString(capteurData);

            // Diffuser le message JSON via WebSocket
            capteurWebSocket.broadcast(jsonMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return capteur;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Capteur updateCapteur(@PathParam("id") Long id, Capteur updatedCapteur) {
        Capteur capteur = Capteur.findById(id);
        if (capteur == null) {
            throw new WebApplicationException("Capteur avec l'ID " + id + " non trouvé.", 404);
        }
        capteur.type = updatedCapteur.type;
        capteur.emplacement = updatedCapteur.emplacement;
        capteur.valeur = updatedCapteur.valeur;

        try {
            // Créer une map pour les nouvelles données du capteur
            Map<String, Object> capteurData = new HashMap<>();
            capteurData.put("type", capteur.type);
            capteurData.put("emplacement", capteur.emplacement);
            capteurData.put("valeur", capteur.valeur);

            // Convertir la map en chaîne JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonMessage = objectMapper.writeValueAsString(capteurData);

            // Diffuser le message JSON via WebSocket
            capteurWebSocket.broadcast(jsonMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return capteur;
    }
}
