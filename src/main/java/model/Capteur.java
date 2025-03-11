package model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import java.time.LocalDateTime;

@Entity
public class Capteur extends PanacheEntity {
    @Column(nullable = false)
    public String type;

    @Column(nullable = false)
    public String emplacement;

    public double valeur;

    @Column(nullable = false)
    public LocalDateTime timestamp; // Ajout du timestamp

    public Capteur() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}