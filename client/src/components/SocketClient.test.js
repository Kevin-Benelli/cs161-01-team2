import { render, screen } from "@testing-library/react";
import SocketClient from "./socketclient";

describe("Async SocketClient API Get Request", () => {
  test("renders question if request succeeds", () => {
    // Arrange: Set up test data, conditions, env
    render(<SocketClient />);

    // Act..nothing

    // Assert
    const joinHeaderElement = screen.getByText("Join Quiz Room Now!", {
      exact: false,
    });

    expect(joinHeaderElement).toBeInTheDocument();

    const joinRoomButton = screen.getByText("Join Room", { exact: true });
    expect(joinRoomButton).toBeInTheDocument();

    // expect(joinRoomButton).toBeInDocument();
  });
});
