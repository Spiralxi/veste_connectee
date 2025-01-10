package model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

@Entity
public class Capteur extends PanacheEntity {
    @Column(nullable = false)
    public String type;

    @Column(nullable = false)
    public String emplacement;

    public double valeur;
}
