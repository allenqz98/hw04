defmodule Memory do

  def new do
    %{
      board: Enum.shuffle(["A","A","B","B","C","C","D","D","E","E","F","F","G","G","H","H"]),
      selected: [],
      correct: [],
    }
  end

  def filter(game) do
    Enum.map(Enum.with_index(game.board), fn {val, index} ->
    cond do
      Enum.member?(game.selected, index) ->
        val
      Enum.member?(game.correct, index) ->
        val
      true -> view_board = "_"
    end end)

  end

  def client_view(game) do
    %{
      board: filter(game),
      selected: game.selected,
      correct: game.correct,
    }
  end


  def guess(game, index) do
    IO.inspect(game)
    IO.inspect(length(game.selected))
    if !Enum.member?(game.correct, index) do
      if length(game.selected) == 0 do
        IO.puts("adding")
        game = Map.put(game, :selected, [index])
      else
        IO.puts("matching")
        check_match(game, Enum.at(game.selected, 0), index)
      end
    end
  end


  def check_match(game, i, j) do
    if Enum.at(game.board, i) === Enum.at(game.board, j) do
      IO.puts(i)
      IO.puts(j)
      game
      |> Map.put(:correct, game.correct ++ [i, j])
      |> Map.put(:selected, [])
    else
      game = Map.put(game, :selected, [])
    end
  end

end