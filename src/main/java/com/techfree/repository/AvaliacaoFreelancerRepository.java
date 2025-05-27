package com.techfree.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.techfree.model.AvaliacaoFreelancer;
import com.techfree.model.Freelancer;
import java.util.List;

@Repository
public interface AvaliacaoFreelancerRepository extends JpaRepository<AvaliacaoFreelancer, Long> {
    List<AvaliacaoFreelancer> findByFreelancer(Freelancer freelancer);
}
