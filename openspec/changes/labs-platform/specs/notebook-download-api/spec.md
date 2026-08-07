# Notebook Download API Specification

## Purpose

`GET /api/notebook/[module]/[lesson]` serves the stored `notebook.ipynb` as a file download, preserving executed cell outputs. It follows the existing API-route auth pattern: no session means no file.

## Requirements

### Requirement: REQ-NBAPI-01 Route and Auth

The API MUST expose `GET /api/notebook/[module]/[lesson]` and MUST return `401` when no Clerk session exists, matching the auth pattern of other API routes.

#### Scenario: Unauthenticated request

- GIVEN a request without a Clerk session
- WHEN `GET /api/notebook/python/lesson01_hello` is called
- THEN the response is `401`

### Requirement: REQ-NBAPI-02 Download Response

For an existing file, the API MUST respond `200` with `Content-Type: application/x-ipynb+json`, `Content-Disposition: attachment; filename="notebook.ipynb"`, and the raw file bytes as body.

#### Scenario: Valid download

- GIVEN an authenticated request for a lesson with `notebook.ipynb`
- WHEN the route resolves
- THEN the response carries the ipynb content type, attachment disposition, and exact file bytes

### Requirement: REQ-NBAPI-03 Missing File

When `notebook.ipynb` does not exist for the lesson, the API MUST return `404`.

#### Scenario: File absent

- GIVEN a lesson without a notebook file
- WHEN the route resolves
- THEN the response is `404`

### Requirement: REQ-NBAPI-04 Preserved Outputs

The API MUST serve the file bytes as stored — it MUST NOT re-execute, strip, or regenerate cells, so the 42 notebooks with executed outputs keep them.

#### Scenario: Stored outputs intact

- GIVEN a notebook with executed cells and stored stdout/plots
- WHEN it is downloaded
- THEN the received file contains those outputs unchanged

### Requirement: REQ-NBAPI-05 Path Safety

The route MUST resolve the file inside the lesson directory and MUST reject `[module]`/`[lesson]` segments that escape `src/content/modules` (e.g. path traversal) with `404`.

#### Scenario: Traversal rejected

- GIVEN a request with a `lesson` segment containing `../`
- WHEN the route resolves the path
- THEN it returns `404` and reads no file outside the content root

## Out of Scope

- Live notebook execution or rendering (phase 3)
- Notebook upload or editing
- Caching or content negotiation beyond the download response
