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
import java.time.LocalDateTime;

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
        capteur.timestamp = LocalDateTime.now(); // Ajout du timestamp
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

    @DELETE
    @Path("/{id}")
    @Transactional
    public void deleteCapteur(@PathParam("id") Long id) {
        Capteur capteur = Capteur.findById(id);
        if (capteur == null) {
            throw new WebApplicationException("Capteur avec l'ID " + id + " non trouvé.", 404);
        }
        capteur.delete();

        try {
            // Diffuser un message via WebSocket indiquant qu'un capteur a été supprimé
            String jsonMessage = String.format("{\"message\": \"Capteur avec ID %d supprimé.\"}", id);
            capteurWebSocket.broadcast(jsonMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GET
    @Path("/historique/ecg")
    public List<Capteur> getHistoriqueECG() {
        // 1) On filtre par type = 'Electrocardiogramme'
        // 2) On trie par timestamp DESC pour avoir les plus récents en premier
        // 3) On limite la requête aux 10 enregistrements les plus récents
        return Capteur.find("type = ?1 ORDER BY timestamp DESC", "Electrocardiogramme")
                .page(0, 10)
                .list();
    }

    // Historique Température (déjà ajouté)
    @GET
    @Path("/historique/temperature")
    public List<Capteur> getHistoriqueTemperature() {
        return Capteur.find("type = ?1 ORDER BY timestamp DESC", "Température")
                .page(0, 10)
                .list();
    }

    // Historique Humidité (nouveau)
    @GET
    @Path("/historique/humidite")
    public List<Capteur> getHistoriqueHumidite() {
        return Capteur.find("type = ?1 ORDER BY timestamp DESC", "Humidité")
                .page(0, 10)
                .list();
    }

    // Historique Qualité de l'air (nouveau)
    @GET
    @Path("/historique/qualiteair")
    public List<Capteur> getHistoriqueQualiteAir() {
        return Capteur.find("type = ?1 ORDER BY timestamp DESC", "Qualité de l'air")
                .page(0, 10)
                .list();
    }

    // Historique Bruit (nouveau)
    @GET
    @Path("/historique/bruit")
    public List<Capteur> getHistoriqueBruit() {
        return Capteur.find("type = ?1 ORDER BY timestamp DESC", "Bruit")
                .page(0, 10)
                .list();
    }
}
