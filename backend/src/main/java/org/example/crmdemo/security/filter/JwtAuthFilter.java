package org.example.crmdemo.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.crmdemo.entities.Manager;
import org.example.crmdemo.repositories.ManagerRepository;
import org.example.crmdemo.services.ManagerService;
import org.example.crmdemo.utilities.JwtUtility;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
@Component

public class JwtAuthFilter extends OncePerRequestFilter {
    private static final String AUTH_HEADER_PREFIX = "Bearer ";

    private final JwtUtility jwtUtility;
    private final ManagerService managerService;
    private final ManagerRepository managerRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith(AUTH_HEADER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(AUTH_HEADER_PREFIX.length());

        try {
            if (jwtUtility.isTokenExpired(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtUtility.extractUsername(token);


            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Optional<Manager> optionalManager = managerRepository.findByEmail(email);
                if (optionalManager.isEmpty()) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Unauthorized");
                    return;
                }

                Manager manager = optionalManager.get();
                if (Boolean.TRUE.equals(manager.getIsBanned())) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Account banned");
                    return;
                }


                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = managerService.loadUserByUsername(email);

                    if (email.equals(userDetails.getUsername())) {
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Auth fail", e);
        }
        filterChain.doFilter(request, response);
    }
}
