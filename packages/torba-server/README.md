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

#### GET /v1/fetchFile

Query Parameters:

```typescript
type Query = {
  bucket: string;
  key: string;
};
```

response:

```typescript
type Response = {
  success: true;
  result: GetObjectCommandOutput; // из @aws-sdk/client-s3
};
```

#### PUT /v1/uploadFile

Query Parameters:

```typescript
type Query = {
  url: string;
  ticketJwt: string;
};
```
