# torba-server

### Docker

EXPOSE port 3075

## API

#### POST /v1/checkApp

request:

```typescript
type Request = {
  name: string;
  secret: string;
};
```

response:

```typescript
type Response = {
  success: true;
  result: boolean;
};
```

#### POST /v1/generateUrl

request:

```typescript
type Request = {
  ticketJwt: string;
  file: {
    name: string;
    type: string;
  };
};
```

response:

```typescript
type Response = {
  success: true;
  result: {
    putUrl: string;
    getUrl: string;
    id: string;
    file: {
      name: string;
      type: string;
    };
  };
};
```
