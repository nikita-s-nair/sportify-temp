package com.sportsvenue.venuemanagement.service;

import com.sportsvenue.venuemanagement.model.Venue;
import java.util.List;

public interface VenueService {
    List<Venue> getAllVenues();

    Venue getVenueById(Long id);

    Venue createVenue(Venue venue);

    Venue updateVenue(Long id, Venue updatedVenue);

    void deleteVenue(Long id);

    List<Venue> searchVenues(String name, String location, String sportType);
}
