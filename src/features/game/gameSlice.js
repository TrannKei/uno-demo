import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const initialState = {
    gameOver: true,
    winner: '',
    turn: '',
    deckOfPlayers: {},
    player1Deck: [],
    player2Deck: [],
    currentColor: '',
    currentNumber: '',
    playedCardsPile: [],
    drawCardPile: []
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        resetGame: () => initialState,
        initializeGame: (_, { payload }) => payload,
        updateGame: (state, { payload }) => {
            console.log('State game moi ', payload);
            const newState = {
                ...state,
                ...payload
            }
            console.log(newState);
            return newState;
        },
        updateMessage: (_, { payload }) => {
            console.log('Updat message moi', payload);
        }
    }
})

export const { resetGame, initializeGame, updateGame, updateMessage } = gameSlice.actions;

export default gameSlice.reducer;