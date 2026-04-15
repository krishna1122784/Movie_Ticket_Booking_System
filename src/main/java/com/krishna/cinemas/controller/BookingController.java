package com.krishna.cinemas.controller;

import com.krishna.cinemas.model.Booking;
import com.krishna.cinemas.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // <-- Ye @Controller nahi, @RestController hona chahiye
@RequestMapping("/api/bookings") // <-- Spelling check karo 'bookings'
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping // <-- Frontend se POST request aa rahi hai
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        // Log check karne ke liye console mein
        System.out.println("Received booking for: " + booking.getMovieTitle());
        return ResponseEntity.ok(bookingRepository.save(booking));
    }
}