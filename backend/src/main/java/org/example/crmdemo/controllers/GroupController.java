package org.example.crmdemo.controllers;

import lombok.RequiredArgsConstructor;
import org.example.crmdemo.services.GroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/api/groups")
public class GroupController {
    private final GroupService groupService;

    @GetMapping("/")
    public ResponseEntity<List<String>> getGroups() {
        return new ResponseEntity<>(groupService.getAllGroupNames(), HttpStatus.OK);
    }
}