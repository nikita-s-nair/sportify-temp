package com.sportsvenue.venuemanagement.repository;

import com.sportsvenue.venuemanagement.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user u JOIN FETCH b.venue v WHERE b.user.id = :userId")
    List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user u JOIN FETCH b.venue v WHERE b.user.username = :username")
    List<Booking> findByUserUsername(@Param("username") String username);

    List<Booking> findByVenueId(Long venueId);
    
    List<Booking> findByVenueIdAndBookingDate(Long venueId, LocalDate bookingDate);
    
    @Query("SELECT b FROM Booking b WHERE b.venue.id = :venueId AND b.bookingDate = :date " +
           "AND b.courtNumber = :courtNumber AND b.status != 'CANCELLED' " +
           "AND ((b.startTime <= :endTime AND b.endTime >= :startTime))")
    List<Booking> findConflictingBookings(
        @Param("venueId") Long venueId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime,
        @Param("courtNumber") Integer courtNumber
    );

    @Query("SELECT b FROM Booking b JOIN FETCH b.venue v WHERE v.manager.id = :managerId")
    List<Booking> findByVenueManagerId(@Param("managerId") Long managerId);
}
