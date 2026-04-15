package com.krishna.cinemas.repository;

import com.krishna.cinemas.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}