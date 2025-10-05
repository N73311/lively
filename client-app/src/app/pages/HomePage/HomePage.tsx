// * Imports
import { observer } from "mobx-react";
import React from "react";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import LoginForm from "../../components/user/LoginForm/LoginForm";
import RegisterForm from "../../components/user/RegisterForm/RegisterForm";

import { useAuthRedirect } from "../../../hooks/useAuthRedirect";
import { useModalStore } from "../../../hooks/useModalStore";

// * Component
const HomePage = () => {
  const { openModal } = useModalStore();

  return useAuthRedirect(
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container className={"home-page-container"} text textAlign={"center"}>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Lively
        </Header>
        <Header as="h2" inverted style={{ fontWeight: 'normal', marginBottom: '1.5rem' }}>
          Real-Time Social Event Management Platform
        </Header>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
          Create, organize, and manage events with live chat, activity feeds, and real-time attendee updates.
          Built with ASP.NET Core, React, and SignalR for seamless real-time collaboration.
        </p>
        <Container text style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            <div>
              <Header as="h4" inverted>📅 Event Management</Header>
              <p style={{ opacity: 0.85 }}>Create and manage social events with detailed information and attendee tracking</p>
            </div>
            <div>
              <Header as="h4" inverted>💬 Live Chat</Header>
              <p style={{ opacity: 0.85 }}>Real-time messaging with SignalR WebSocket connections</p>
            </div>
            <div>
              <Header as="h4" inverted>🔔 Activity Feed</Header>
              <p style={{ opacity: 0.85 }}>Stay updated with live notifications and event updates</p>
            </div>
            <div>
              <Header as="h4" inverted>👥 User Profiles</Header>
              <p style={{ opacity: 0.85 }}>Manage your profile, follow others, and track your events</p>
            </div>
          </div>
        </Container>
        <Button.Group widths={2} size={"big"}>
          <Button onClick={() => openModal(<LoginForm />)} size="huge" inverted>
            Login
          </Button>
          <Button
            onClick={() => openModal(<RegisterForm />)}
            size="huge"
            inverted
          >
            Register
          </Button>
        </Button.Group>
      </Container>
    </Segment>
  );
};

// * Exports
export default observer(HomePage);
