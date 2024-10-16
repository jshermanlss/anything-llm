// src/App.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const App: React.FC = () => {
  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h1>Welcome to Sentinel UI!</h1>
          <p>This is the initial setup with Bootstrap, Redux, and RTK Query.</p>
          <button className="btn btn-outline-primary">Enter Here</button>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
