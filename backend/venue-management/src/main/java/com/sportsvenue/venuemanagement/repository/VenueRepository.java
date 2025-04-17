package com.sportsvenue.venuemanagement.repository;

import com.sportsvenue.venuemanagement.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long> {
}
