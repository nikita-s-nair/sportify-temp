package com.sportsvenue.venuemanagement.controller;

import com.sportsvenue.venuemanagement.model.Venue;
import com.sportsvenue.venuemanagement.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(VenueController.class);

    @Autowired
    private VenueService venueService;

    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        try {
            List<Venue> venues = venueService.getAllVenues();
            return success(venues);
        } catch (Exception e) {
            logger.error("Error fetching all venues", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        try {
            Venue venue = venueService.getVenueById(id);
            return success(venue);
        } catch (RuntimeException e) {
            logger.error("Venue not found with id: " + id, e);
            return notFound();
        } catch (Exception e) {
            logger.error("Error fetching venue with id: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') || hasRole('MANAGER')")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Venue> createVenue(@RequestBody Venue venue) {
        try {
            Venue createdVenue = venueService.createVenue(venue);
            return success(createdVenue);
        } catch (Exception e) {
            logger.error("Error creating venue", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') || hasRole('MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id, @RequestBody Venue venue) {
        try {
            Venue updatedVenue = venueService.updateVenue(id, venue);
            return success(updatedVenue);
        } catch (RuntimeException e) {
            logger.error("Venue not found with id: " + id, e);
            return notFound();
        } catch (Exception e) {
            logger.error("Error updating venue with id: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') || hasRole('MANAGER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        try {
            venueService.deleteVenue(id);
            return success(null);
        } catch (Exception e) {
            logger.error("Error deleting venue with id: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Venue>> searchVenues(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String sportType) {
        try {
            List<Venue> venues = venueService.searchVenues(name, location, sportType);
            return success(venues);
        } catch (Exception e) {
            logger.error("Error searching venues", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
