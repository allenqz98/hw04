defmodule MemoryWeb.UserSocket do
  use Phoenix.Socket

  channel "games:*",MemoryWeb.GamesChannel
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end
  
  def id(_socket), do: nil

end
