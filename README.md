# ptr-state package

# New BE update notes

- ADD BE support for notin filter like it was in ensureIndexed
- if new BE will always return Array of items, then fix request.js
- variable categoryPath is usually be-metadata is it correct?
- apiDelete can delete only one item
- apiUpdate expect in result.body array, but it takes only first as a updated
- saveEdited prepare specific structure
- add tests for ensureKey
- remove processPatchResponse
- remove processResponse
- BE should always return correct total length
- test pagination for requests
- fix request method -> handling response object vs. array and checking dataType
