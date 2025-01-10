package resource;

import model.Capteur;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
    public Response createCapteur(Capteur capteur) {
        // Validation des données
        if (capteur.emplacement == null || capteur.emplacement.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Le champ 'emplacement' est obligatoire.")
                    .build();
        }

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

        return Response.ok(capteur).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateCapteur(@PathParam("id") Long id, Capteur updatedCapteur) {
        Capteur capteur = Capteur.findById(id);
        if (capteur == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Capteur avec l'ID " + id + " non trouvé.")
                    .build();
        }

        // Validation des données
        if (updatedCapteur.emplacement == null || updatedCapteur.emplacement.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Le champ 'emplacement' est obligatoire.")
                    .build();
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

        return Response.ok(capteur).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteCapteur(@PathParam("id") Long id) {
        Capteur capteur = Capteur.findById(id);
        if (capteur == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Capteur avec l'ID " + id + " non trouvé.")
                    .build();
        }
        capteur.delete();

        try {
            // Diffuser un message via WebSocket indiquant qu'un capteur a été supprimé
            String jsonMessage = String.format("{\"message\": \"Capteur avec ID %d supprimé.\"}", id);
            capteurWebSocket.broadcast(jsonMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Response.noContent().build();
    }
}
