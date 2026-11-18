import React, { useState, useEffect, useRef } from 'react';
import { Users, Gamepad2, Trophy, Save, RotateCcw, AlertCircle, Medal, Star, Plus, ClipboardList, X, Download, Upload, FileText, Settings, Shuffle, Unlock, Lock, Edit2, Trash2, Database } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'ea-fc-tourney-v3';

// Chaves do Firebase
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
      apiKey: "AIzaSyCykbsiGrm-uOy_fN1-1ObfQx-wvjZS2Rs",
      authDomain: "draft-10th-2026.firebaseapp.com",
      projectId: "draft-10th-2026",
      storageBucket: "draft-10th-2026.firebasestorage.app",
      messagingSenderId: "400352460177",
      appId: "1:400352460177:web:fe0572726fce7e504bee30"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 1. Matriz Completa de Formações do EA FC
const FORMATIONS = (() => {
  const buildFormation = (positions) => positions.map((p, i) => ({ id: i, ...p }));

  const G = { label: 'GOL', top: '88%', left: '50%' };
  const LE = { label: 'LE', top: '70%', left: '15%' };
  const LD = { label: 'LD', top: '70%', left: '85%' };
  const ADE = { label: 'ADE', top: '65%', left: '12%' };
  const ADD = { label: 'ADD', top: '65%', left: '88%' };
  const Z4_1 = { label: 'ZAG', top: '72%', left: '35%' };
  const Z4_2 = { label: 'ZAG', top: '72%', left: '65%' };
  const Z3_1 = { label: 'ZAG', top: '72%', left: '25%' };
  const Z3_2 = { label: 'ZAG', top: '74%', left: '50%' };
  const Z3_3 = { label: 'ZAG', top: '72%', left: '75%' };
  const Z5_1 = { label: 'ZAG', top: '74%', left: '30%' };
  const Z5_2 = { label: 'ZAG', top: '75%', left: '50%' };
  const Z5_3 = { label: 'ZAG', top: '74%', left: '70%' };
  const V1 = { label: 'VOL', top: '60%', left: '50%' };
  const V2_1 = { label: 'VOL', top: '58%', left: '35%' };
  const V2_2 = { label: 'VOL', top: '58%', left: '65%' };
  const M1 = { label: 'MC', top: '48%', left: '50%' };
  const M2_1 = { label: 'MC', top: '48%', left: '35%' };
  const M2_2 = { label: 'MC', top: '48%', left: '65%' };
  const M3_1 = { label: 'MC', top: '48%', left: '25%' };
  const M3_2 = { label: 'MC', top: '50%', left: '50%' };
  const M3_3 = { label: 'MC', top: '48%', left: '75%' };
  const ME = { label: 'ME', top: '45%', left: '15%' };
  const MD = { label: 'MD', top: '45%', left: '85%' };
  const MEI1 = { label: 'MEI', top: '35%', left: '50%' };
  const MEI2_1 = { label: 'MEI', top: '35%', left: '30%' };
  const MEI2_2 = { label: 'MEI', top: '35%', left: '70%' };
  const MEI3_1 = { label: 'MEI', top: '38%', left: '25%' };
  const MEI3_2 = { label: 'MEI', top: '38%', left: '50%' };
  const MEI3_3 = { label: 'MEI', top: '38%', left: '75%' };
  const SA1 = { label: 'SA', top: '28%', left: '50%' };
  const SA2_1 = { label: 'SA', top: '28%', left: '30%' };
  const SA2_2 = { label: 'SA', top: '28%', left: '70%' };
  const PE = { label: 'PE', top: '22%', left: '20%' };
  const PD = { label: 'PD', top: '22%', left: '80%' };
  const A1 = { label: 'ATA', top: '15%', left: '50%' };
  const A2_1 = { label: 'ATA', top: '18%', left: '35%' };
  const A2_2 = { label: 'ATA', top: '18%', left: '65%' };

  const DEF3 = [Z3_1, Z3_2, Z3_3];
  const DEF4 = [LE, Z4_1, Z4_2, LD];
  const DEF5 = [ADE, Z5_1, Z5_2, Z5_3, ADD];
  const MID2 = [M2_1, M2_2];
  const MID3 = [M3_1, M3_2, M3_3];
  const ATK2 = [A2_1, A2_2];

  return {
    '3-1-4-2': buildFormation([G, ...DEF3, V1, ME, ...MID2, MD, ...ATK2]),
    '3-4-1-2': buildFormation([G, ...DEF3, ME, ...MID2, MD, MEI1, ...ATK2]),
    '3-4-2-1': buildFormation([G, ...DEF3, ME, ...MID2, MD, SA2_1, SA2_2, A1]),
    '3-4-3': buildFormation([G, ...DEF3, ME, ...MID2, MD, PE, A1, PD]),
    '3-4-3 Flat': buildFormation([G, ...DEF3, ME, ...MID2, MD, PE, A1, PD]),
    '3-5-2': buildFormation([G, ...DEF3, V2_1, V2_2, ME, MD, MEI1, ...ATK2]),
    '4-1-2-1-2': buildFormation([G, ...DEF4, V1, ME, MD, MEI1, ...ATK2]),
    '4-1-2-1-2 (2)': buildFormation([G, ...DEF4, V1, ...MID2, MEI1, ...ATK2]),
    '4-1-2-1-2 Narrow': buildFormation([G, ...DEF4, V1, ...MID2, MEI1, ...ATK2]),
    '4-1-2-1-2 Wide': buildFormation([G, ...DEF4, V1, ME, MD, MEI1, ...ATK2]),
    '4-1-3-2': buildFormation([G, ...DEF4, V1, ME, M1, MD, ...ATK2]),
    '4-1-4-1': buildFormation([G, ...DEF4, V1, ME, ...MID2, MD, A1]),
    '4-2-1-3': buildFormation([G, ...DEF4, V2_1, V2_2, MEI1, PE, A1, PD]),
    '4-2-2-2': buildFormation([G, ...DEF4, V2_1, V2_2, MEI2_1, MEI2_2, ...ATK2]),
    '4-2-3-1': buildFormation([G, ...DEF4, V2_1, V2_2, MEI3_1, MEI3_2, MEI3_3, A1]),
    '4-2-3-1 (2)': buildFormation([G, ...DEF4, V2_1, V2_2, ME, MEI1, MD, A1]),
    '4-2-3-1 Narrow': buildFormation([G, ...DEF4, V2_1, V2_2, MEI3_1, MEI3_2, MEI3_3, A1]),
    '4-2-3-1 Wide': buildFormation([G, ...DEF4, V2_1, V2_2, ME, MEI1, MD, A1]),
    '4-2-4': buildFormation([G, ...DEF4, ...MID2, PE, ...ATK2, PD]),
    '4-3-1-2': buildFormation([G, ...DEF4, ...MID3, MEI1, ...ATK2]),
    '4-3-2-1': buildFormation([G, ...DEF4, ...MID3, SA2_1, SA2_2, A1]),
    '4-3-3': buildFormation([G, ...DEF4, ...MID3, PE, A1, PD]),
    '4-3-3 (2)': buildFormation([G, ...DEF4, V1, ...MID2, PE, A1, PD]),
    '4-3-3 (3)': buildFormation([G, ...DEF4, V2_1, V2_2, M1, PE, A1, PD]),
    '4-3-3 (4)': buildFormation([G, ...DEF4, ...MID2, MEI1, PE, A1, PD]),
    '4-3-3 Attack': buildFormation([G, ...DEF4, ...MID2, MEI1, PE, A1, PD]),
    '4-3-3 Defend': buildFormation([G, ...DEF4, V2_1, V2_2, M1, PE, A1, PD]),
    '4-3-3 Flat': buildFormation([G, ...DEF4, ...MID3, PE, A1, PD]),
    '4-3-3 Holding': buildFormation([G, ...DEF4, V1, ...MID2, PE, A1, PD]),
    '4-4-1-1 (2)': buildFormation([G, ...DEF4, ME, ...MID2, MD, MEI1, A1]),
    '4-4-1-1 Midfield': buildFormation([G, ...DEF4, ME, ...MID2, MD, SA1, A1]),
    '4-4-2': buildFormation([G, ...DEF4, ME, ...MID2, MD, ...ATK2]),
    '4-4-2 (2)': buildFormation([G, ...DEF4, ME, V2_1, V2_2, MD, ...ATK2]),
    '4-4-2 Flat': buildFormation([G, ...DEF4, ME, ...MID2, MD, ...ATK2]),
    '4-4-2 Holding': buildFormation([G, ...DEF4, ME, V2_1, V2_2, MD, ...ATK2]),
    '4-5-1': buildFormation([G, ...DEF4, ME, M1, MD, MEI2_1, MEI2_2, A1]),
    '4-5-1 (2)': buildFormation([G, ...DEF4, ME, ...MID3, MD, A1]),
    '4-5-1 Attack': buildFormation([G, ...DEF4, ME, M1, MD, MEI2_1, MEI2_2, A1]),
    '4-5-1 Flat': buildFormation([G, ...DEF4, ME, ...MID3, MD, A1]),
    '5-2-1-2': buildFormation([G, ...DEF5, ...MID2, MEI1, ...ATK2]),
    '5-2-3': buildFormation([G, ...DEF5, ...MID2, PE, A1, PD]),
    '5-3-2': buildFormation([G, ...DEF5, ...MID3, ...ATK2]),
    '5-3-2 Holding': buildFormation([G, ...DEF5, V1, ...MID2, ...ATK2]),
    '5-4-1': buildFormation([G, ...DEF5, ME, ...MID2, MD, A1]),
    '5-4-1 Flat': buildFormation([G, ...DEF5, ME, ...MID2, MD, A1])
  };
})();

// DADOS INICIAIS
const preFilledPlayers = [
  { id: 'p_augusto', name: 'Augusto', baseTeam: '', tradesUsed: 0, picks: ['K.Mbappe', 'W. Pacho', 'D. Szboszlai', 'D. Dumphries', 'Harry Kane', 'T. Courtois', 'N. Barella', 'A. Grimaldo', 'J. Gvardiol', 'R. Gravenberch', 'K. Adeyemi', 'B. Saka', 'F. De Jong', 'M. Cunha', 'Zagueiro Konaté', 'Reece James', 'W. Zaire Emery', 'C. Palmer'] },
  { id: 'p_afonso', name: 'Afonso', baseTeam: '', tradesUsed: 0, picks: ['Yamal', 'Rodri', 'Gabriel', 'Cucurella', 'F. Wirtz', 'J. Neves', 'E. Fernandez', 'Marquinhos', 'Matheus Nunes', 'A. Semenyo', 'G. Donnaruma', 'A. Isak', 'T. Reijnders', 'Quinones', 'Eric Garcia', 'I. Ndiaye', 'E. Anderson', 'P. Dybala'] },
  { id: 'p_thalles', name: 'Thalles Leal', baseTeam: '', tradesUsed: 0, picks: ['O. Dembele', 'Pedri', 'W. Saliba', 'M. Caicedo', 'Di Marco', 'J. Musiala', 'L. Martínez', 'T. Alexander-Arnold', 'R. Dias', 'Rodrygo', 'N. Williams', 'K. De Bruyne', 'J. Cancelo', 'M. Rogers', 'E. Konsa', 'P. Porro', 'Nico Paz', 'M. Maignan'] },
  { id: 'p_kildare', name: 'Kildare', baseTeam: '', tradesUsed: 0, picks: ['E. Haaland', 'Vitinha', 'K. Kvaratskhelia', 'J. Kimmich', 'Bruno Fernandes', 'A. Bastoni', 'D. Doue', 'V. van Djik', 'K. Laimmer', "N. O'Reilly", 'K. Yildiz', 'A. Tchouameni', 'F. Torres', 'M. Odegaard', 'Goleiro Alisson', 'M. Thuram', 'J. Timber', 'J. Santos'] },
  { id: 'p_lucas', name: 'Lucas', baseTeam: '', tradesUsed: 0, picks: ['Vini Jr', 'Olise', 'Hakimi', 'J. Alvarez', 'M. Salah', 'Bremer', 'M. van de Ven', 'T. Hernandéz', 'F. Nmecha', 'H. Ekitiké', 'J. Oblak', 'A. Garcia', 'S. Milinkovic-Savic', 'M. Rashford', 'A. Khusanov', 'A. Griezmann', 'A. Davies', 'P. Foden'] },
  { id: 'p_vitor', name: 'Vitor', baseTeam: '', tradesUsed: 0, picks: ['Raphinha', 'Valverde', 'Upamecano', 'M. Llorente', 'S. McTominay', 'B. Barcola', 'P Hincapie', 'B. Mbeumo', 'R. Cherki', 'R. Ibanez', 'J. Garcia', 'J. Doku', 'E. Militão', 'Fermín :)', 'M. Lacroix', 'N. Kanté', 'D. Malen', 'J. Félix'] },
  { id: 'p_thamer', name: 'Thamer', baseTeam: '', tradesUsed: 0, picks: ['Bellingham', 'Nuno Mendes', 'Schlotterbeck', 'Declan Rice', 'V. Gyokeres', 'L. Messi', 'J. Koundé', 'L. Diaz', 'P. Cubarsi', 'Y. Diomande', 'V. Osimhen', 'G. Kobel', 'S. Tonali', 'R. Leão', 'J. Tah', 'G. Simeone', 'D. Raum', 'C. Pulisic'] }
];

const preFilledMatches = [
  { id: 'm1_1', round: 'Rodada 1', homeId: 'p_afonso', awayId: 'p_thamer', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm1_2', round: 'Rodada 1', homeId: 'p_thalles', awayId: 'p_vitor', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm1_3', round: 'Rodada 1', homeId: 'p_kildare', awayId: 'p_lucas', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm2_1', round: 'Rodada 2', homeId: 'p_augusto', awayId: 'p_thamer', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm2_2', round: 'Rodada 2', homeId: 'p_afonso', awayId: 'p_lucas', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm2_3', round: 'Rodada 2', homeId: 'p_thalles', awayId: 'p_kildare', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm3_1', round: 'Rodada 3', homeId: 'p_augusto', awayId: 'p_vitor', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm3_2', round: 'Rodada 3', homeId: 'p_thamer', awayId: 'p_lucas', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm3_3', round: 'Rodada 3', homeId: 'p_afonso', awayId: 'p_thalles', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm4_1', round: 'Rodada 4', homeId: 'p_augusto', awayId: 'p_lucas', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm4_2', round: 'Rodada 4', homeId: 'p_vitor', awayId: 'p_kildare', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm4_3', round: 'Rodada 4', homeId: 'p_thamer', awayId: 'p_thalles', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm5_1', round: 'Rodada 5', homeId: 'p_augusto', awayId: 'p_kildare', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm5_2', round: 'Rodada 5', homeId: 'p_lucas', awayId: 'p_thalles', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm5_3', round: 'Rodada 5', homeId: 'p_vitor', awayId: 'p_afonso', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm6_1', round: 'Rodada 6', homeId: 'p_augusto', awayId: 'p_thalles', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm6_2', round: 'Rodada 6', homeId: 'p_kildare', awayId: 'p_afonso', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm6_3', round: 'Rodada 6', homeId: 'p_vitor', awayId: 'p_thamer', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm7_1', round: 'Rodada 7', homeId: 'p_augusto', awayId: 'p_afonso', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm7_2', round: 'Rodada 7', homeId: 'p_kildare', awayId: 'p_thamer', homeScore: '', awayScore: '', isPlayed: false },
  { id: 'm7_3', round: 'Rodada 7', homeId: 'p_lucas', awayId: 'p_vitor', homeScore: '', awayScore: '', isPlayed: false }
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('draft');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Modo Admin Seguro
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  
  // Controles de Adição/Edição de Partida
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [newMatchHome, setNewMatchHome] = useState('');
  const [newMatchAway, setNewMatchAway] = useState('');

  const [tacticsTeamId, setTacticsTeamId] = useState('');
  const [selectingSlot, setSelectingSlot] = useState(null);
  const fileInputRef = useRef(null);

  const defaultInitialState = {
    phase: 'LOCKED',
    setupNames: [],
    players: preFilledPlayers,
    leagueMatches: preFilledMatches,
    knockoutMatches: [],
    lineups: {}
  };

  const [state, setState] = useState(defaultInitialState);

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Sincronização Firebase
  useEffect(() => {
    let unsubscribe = () => {};

    const initFirebase = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined') {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
        if (!auth.currentUser) return;

        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'tournament', 'main');
        
        unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setState({
              phase: data?.phase || 'SETUP',
              setupNames: Array.isArray(data?.setupNames) ? data.setupNames : [],
              players: Array.isArray(data?.players) ? data.players : [],
              leagueMatches: Array.isArray(data?.leagueMatches) ? data.leagueMatches : [],
              knockoutMatches: Array.isArray(data?.knockoutMatches) ? data.knockoutMatches : [],
              lineups: data?.lineups || {}
            });
          } else {
            setDoc(docRef, defaultInitialState);
          }
          setLoading(false);
        }, (error) => {
          console.error("Erro na Sincronização:", error);
          setErrorMessage("Erro ao conectar com a nuvem.");
          setLoading(false);
        });
      } catch (err) {
        console.error("Erro de Autenticação", err);
        setErrorMessage("Erro de acesso ao banco de dados.");
        setLoading(false);
      }
    };

    initFirebase();
    return () => unsubscribe();
  }, []);

  const syncState = async (newState) => {
    setState(newState);
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'tournament', 'main');
      await setDoc(docRef, newState, { merge: true });
    } catch (e) {
      console.error("Erro ao salvar:", e);
    }
  };

  const safePlayers = Array.isArray(state?.players) ? state.players : [];
  const safeMatches = Array.isArray(state?.leagueMatches) ? state.leagueMatches : [];
  const safeKnockout = Array.isArray(state?.knockoutMatches) ? state.knockoutMatches : [];

  // --- FUNÇÕES DE ADMIN ---
  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowAdminPrompt(true);
    }
  };

  const handleAdminSubmit = () => {
    if (adminPin === "2026") {
      setIsAdmin(true);
      setShowAdminPrompt(false);
      setAdminPin('');
      setErrorMessage('');
    } else {
      setErrorMessage("Senha incorreta.");
      setAdminPin('');
    }
  };

  const handleReset = () => {
    if (!isAdmin) return;
    syncState(defaultInitialState);
    setShowResetConfirm(false);
    setActiveTab('draft');
  };

  // --- FUNÇÕES DE TROCA E EDIÇÃO DE JOGADOR ---
  const handlePlayerChange = (id, field, value) => {
    const newPlayers = safePlayers.map(p => p.id === id ? { ...p, [field]: value } : p);
    syncState({ ...state, players: newPlayers });
  };

  const handlePickChange = (playerId, pickIndex, value) => {
    const newPlayers = safePlayers.map(p => {
      if (p.id === playerId) {
        const newPicks = [...(p.picks || Array(18).fill(''))];
        newPicks[pickIndex] = value;
        return { ...p, picks: newPicks };
      }
      return p;
    });
    syncState({ ...state, players: newPlayers });
  };

  const handleTradePlayer = (playerId, pickIndex, currentName) => {
    const player = safePlayers.find(p => p.id === playerId);
    const tradesUsed = player.tradesUsed || 0;
    
    if (!isAdmin && tradesUsed >= 3) {
      setErrorMessage("Limite de 3 trocas atingido para este time.");
      return;
    }

    const newName = window.prompt(`Trocar "${currentName || 'Vazio'}" por qual jogador? (Restam ${isAdmin ? 'Infinitas' : 3 - tradesUsed} trocas)`);
    
    if (newName !== null && newName.trim() !== '') {
      const newPlayers = safePlayers.map(p => {
        if (p.id === playerId) {
          const newPicks = [...(p.picks || Array(18).fill(''))];
          newPicks[pickIndex] = newName.trim();
          return { ...p, picks: newPicks, tradesUsed: isAdmin ? tradesUsed : tradesUsed + 1 };
        }
        return p;
      });
      syncState({ ...state, players: newPlayers });
    }
  };

  // --- FUNÇÕES DE PARTIDA ---
  const handleAddExtraMatch = () => {
    if (!newMatchHome || !newMatchAway || newMatchHome === newMatchAway) return;
    const newMatch = {
      id: `extra_${Date.now()}`,
      round: 'Jogos Extras',
      homeId: newMatchHome,
      awayId: newMatchAway,
      homeScore: '',
      awayScore: '',
      isPlayed: false
    };
    syncState({ ...state, leagueMatches: [...safeMatches, newMatch] });
    setIsAddingMatch(false);
    setNewMatchHome('');
    setNewMatchAway('');
  };

  const handleDeleteMatch = (matchId) => {
    if (!window.confirm("Deseja realmente apagar esta partida?")) return;
    const newMatches = safeMatches.filter(m => m.id !== matchId);
    syncState({ ...state, leagueMatches: newMatches });
  };

  const handleEditMatchTeams = (matchId, newHomeId, newAwayId) => {
    const newMatches = safeMatches.map(m => {
      if (m.id === matchId) {
        return { ...m, homeId: newHomeId, awayId: newAwayId };
      }
      return m;
    });
    syncState({ ...state, leagueMatches: newMatches });
    setEditingMatchId(null);
  };

  const handleMatchScore = (matchId, isHome, score) => {
    const numScore = score === '' ? '' : parseInt(score, 10);
    const newMatches = safeMatches.map(m => {
      if (m.id === matchId) {
        const updated = { ...m, [isHome ? 'homeScore' : 'awayScore']: numScore };
        updated.isPlayed = updated.homeScore !== '' && updated.awayScore !== '';
        return updated;
      }
      return m;
    });
    syncState({ ...state, leagueMatches: newMatches });
  };

  const handleUpdateLineup = (teamId, formation, slotIndex, playerName) => {
    const teamLineup = state?.lineups?.[teamId] || { formation: '4-3-3', players: {} };
    if (formation !== teamLineup.formation) {
      syncState({ ...state, lineups: { ...state.lineups, [teamId]: { formation, players: {} } } });
      return;
    }
    const newPlayers = { ...(teamLineup.players || {}) };
    if (playerName) newPlayers[slotIndex] = playerName;
    else delete newPlayers[slotIndex];
    syncState({ ...state, lineups: { ...state.lineups, [teamId]: { formation, players: newPlayers } } });
    setSelectingSlot(null);
  };

  // --- TABELA DE CLASSIFICAÇÃO ---
  const standingsMap = safePlayers.reduce((acc, p) => {
    acc[p.id] = { ...p, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] };
    return acc;
  }, {});

  safeMatches.filter(m => m && m.isPlayed).forEach(m => {
    const home = standingsMap[m.homeId];
    const away = standingsMap[m.awayId];

    if (home && away) {
      home.played++; away.played++;
      home.gf += m.homeScore; away.gf += m.awayScore;
      home.ga += m.awayScore; away.ga += m.homeScore;
      home.gd = home.gf - home.ga;
      away.gd = away.gf - away.ga;

      if (m.homeScore > m.awayScore) {
        home.won++; home.pts += 3; away.lost++;
        home.form.push('W'); away.form.push('L');
      } else if (m.homeScore < m.awayScore) {
        away.won++; away.pts += 3; home.lost++;
        home.form.push('L'); away.form.push('W');
      } else {
        home.drawn++; home.pts += 1;
        away.drawn++; away.pts += 1;
        home.form.push('D'); away.form.push('D');
      }
    }
  });

  const standings = Object.values(standingsMap);
  standings.forEach(team => { team.form = team.form.slice(-4); });
  standings.sort((a, b) => b.pts - a.pts || b.won - a.won || b.gd - a.gd || b.gf - a.gf);

  // --- MATA-MATA ---
  const handleGenerateKnockout = () => {
    if (standings.length < 4) return;
    const semis = [
      { id: 'sf1', round: 'Semifinal 1', homeId: standings[0].id, awayId: standings[3].id, homeScore: '', awayScore: '', isPlayed: false, nextId: 'final' },
      { id: 'sf2', round: 'Semifinal 2', homeId: standings[1].id, awayId: standings[2].id, homeScore: '', awayScore: '', isPlayed: false, nextId: 'final' }
    ];
    syncState({ ...state, knockoutMatches: semis });
    setActiveTab('knockout');
  };

  const handleKnockoutScore = (matchId, isHome, score) => {
    const numScore = score === '' ? '' : parseInt(score, 10);
    let newKnockout = [...safeKnockout];
    const matchIndex = newKnockout.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;

    newKnockout[matchIndex] = { ...newKnockout[matchIndex], [isHome ? 'homeScore' : 'awayScore']: numScore };
    newKnockout[matchIndex].isPlayed = newKnockout[matchIndex].homeScore !== '' && newKnockout[matchIndex].awayScore !== '';

    const sf1 = newKnockout.find(m => m.id === 'sf1');
    const sf2 = newKnockout.find(m => m.id === 'sf2');

    if (sf1?.isPlayed && sf2?.isPlayed && sf1.homeScore !== sf1.awayScore && sf2.homeScore !== sf2.awayScore) {
      const w1 = sf1.homeScore > sf1.awayScore ? sf1.homeId : sf1.awayId;
      const l1 = sf1.homeScore < sf1.awayScore ? sf1.homeId : sf1.awayId;
      const w2 = sf2.homeScore > sf2.awayScore ? sf2.homeId : sf2.awayId;
      const l2 = sf2.homeScore < sf2.awayScore ? sf2.homeId : sf2.awayId;

      if (!newKnockout.find(m => m.id === 'final')) {
        newKnockout.push({ id: 'third', round: 'Disputa de 3º Lugar', homeId: l1, awayId: l2, homeScore: '', awayScore: '', isPlayed: false });
        newKnockout.push({ id: 'final', round: 'Grande Final', homeId: w1, awayId: w2, homeScore: '', awayScore: '', isPlayed: false });
      } else {
        const finalIdx = newKnockout.findIndex(m => m.id === 'final');
        const thirdIdx = newKnockout.findIndex(m => m.id === 'third');
        if (finalIdx !== -1) newKnockout[finalIdx] = { ...newKnockout[finalIdx], homeId: w1, awayId: w2 };
        if (thirdIdx !== -1) newKnockout[thirdIdx] = { ...newKnockout[thirdIdx], homeId: l1, awayId: l2 };
      }
    }
    syncState({ ...state, knockoutMatches: newKnockout });
  };

  const getPlayerName = (id) => safePlayers.find(p => p.id === id)?.name || 'TBD';

  // --- EXPORTAR DADOS ---
  const exportHistoryJSON = () => {
    const exportData = {
      date: new Date().toISOString(),
      tournamentData: state,
      finalStandings: standings
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historico_campeonato_${Date.now()}.json`;
    link.click();
  };

  const exportTXT = () => {
    let content = "=== ELENCOS DO CAMPEONATO ===\n\n";
    safePlayers.forEach((p, index) => {
      content += `[Pick #${index + 1}] ${p.name || 'Sem Nome'} - Base: ${p.baseTeam || 'Sem Time'}\n`;
      (p.picks || Array(18).fill('')).forEach((player, i) => {
        if (player) content += `  ${i + 1}. ${player}\n`;
      });
      content += "\n";
    });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "elencos_campeonato.txt";
    link.click();
  };

  const exportCSV = () => {
    let csv = "OrdemDraft,Participante,TimeBase," + Array.from({length:18}, (_,i)=>`Pick${i+1}`).join(",") + "\n";
    safePlayers.forEach((p, index) => {
      const row = [index + 1, p.name || "", p.baseTeam || "", ...(p.picks || Array(18).fill('')).map(pl => pl || "")];
      const escaped = row.map(v => `"${String(v).replace(/"/g, '""')}"`);
      csv += escaped.join(",") + "\n";
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "elencos_campeonato.csv";
    link.click();
  };

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) return;
      const newPlayers = [...safePlayers];
      for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
          let nameIdx = 1, baseTeamIdx = 2, picksStart = 3;
          if (isNaN(parseInt(vals[0]))) { nameIdx = 0; baseTeamIdx = 1; picksStart = 2; }
          
          const name = vals[nameIdx] || `Jogador ${i}`;
          const baseTeam = vals[baseTeamIdx] || "";
          const picks = Array(18).fill("");
          for (let j = 0; j < 18; j++) picks[j] = vals[j + picksStart] || "";
          
          const existingIdx = newPlayers.findIndex(p => p.name.toLowerCase().trim() === name.toLowerCase().trim());
          if (existingIdx !== -1) {
            newPlayers[existingIdx] = { ...newPlayers[existingIdx], baseTeam, picks };
          }
      }
      syncState({ ...state, players: newPlayers });
      if(fileInputRef.current) fileInputRef.current.value = null; 
    };
    reader.readAsText(file);
  };

  if (loading) return (<div className="flex h-screen items-center justify-center bg-[#040207] text-white font-cinzel text-xl">Inicializando Sistema...</div>);

  return (
    <div className="min-h-screen text-slate-200 selection:bg-[#8CD3F5]/30 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Gilda+Display&family=Inter:wght@300;400;500;700&display=swap');
        .font-cinzel, .font-gilda { font-family: 'Gilda Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .luxury-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 0%, #171b26 0%, #040207 80%); z-index: -1; }
        .luxury-panel { background: rgba(15, 17, 26, 0.65); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); border-top: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05); }
        .luxury-input { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); color: #F8FAFC; }
        .luxury-input:focus { border-color: #8CD3F5; background: rgba(0, 0, 0, 0.6); box-shadow: 0 0 15px rgba(140, 211, 245, 0.15); }
        .luxury-button { background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.15); box-shadow: inset 0 1px 0 rgba(255,255,255,0.1); }
        .luxury-button:hover { background: linear-gradient(180deg, rgba(140,211,245,0.15) 0%, rgba(140,211,245,0.05) 100%); border-color: rgba(140,211,245,0.4); }
        .ff-title { background: linear-gradient(to bottom, #ffffff 0%, #e0e0e0 40%, #b0c4de 55%, #f8fafc 65%, #ffffff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.9)); font-weight: 400; }
        .admin-glow { box-shadow: 0 0 15px rgba(253, 160, 255, 0.2); border-color: rgba(253, 160, 255, 0.4) !important; }
      `}} />
      <div className="luxury-bg"></div>

      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/EA_Sports_FC_logo.svg/1024px-EA_Sports_FC_logo.svg.png" className="w-[120%] h-auto grayscale object-cover" alt="Watermark Logo" />
      </div>

      {showSplash && (
        <div className="fixed inset-0 bg-[#040207] z-[100] flex flex-col items-center justify-center transition-opacity duration-1000">
           <Trophy size={80} className="text-[#8CD3F5] animate-pulse mb-8 opacity-80" />
           <div className="text-white font-cinzel text-xl sm:text-3xl tracking-[0.5em] font-bold">EA FC DRAFT</div>
           <div className="text-[#FDA0FF] font-cinzel text-sm sm:text-lg tracking-[0.8em] mt-4 opacity-70">EDIÇÃO 10 ANOS</div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-[#040207]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center relative">
          <button onClick={toggleAdmin} className={`p-1.5 rounded-full transition-colors ${isAdmin ? 'text-[#FDA0FF] bg-[#FDA0FF]/10' : 'text-slate-500 hover:text-slate-300'}`} title="Modo Admin">
            {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
          </button>
          
          <div className="flex-1 flex justify-center items-center">
            <div className="text-[12px] sm:text-[14px] font-gilda italic ff-title flex items-center leading-none">
              <Star size={11} className={`${isAdmin ? 'text-[#FDA0FF]' : 'text-[#8CD3F5]'} opacity-70 mr-4`} fill="currentColor" />
              <span style={{ letterSpacing: '0.65em', marginRight: '-0.65em' }}>{isAdmin ? 'ADMINISTRADOR' : 'DRAFT EDIÇÃO 10 ANOS'}</span>
              <Star size={11} className={`${isAdmin ? 'text-[#FDA0FF]' : 'text-[#8CD3F5]'} opacity-70 ml-4`} fill="currentColor" />
            </div>
          </div>
          
          <button onClick={() => isAdmin ? setShowResetConfirm(true) : setErrorMessage("Apenas o Admin pode resetar o banco de dados.")} className={`p-1.5 rounded-full transition-colors ${isAdmin ? 'text-red-400 hover:bg-red-400/10' : 'text-slate-600 opacity-50'}`}>
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* MODAL: SOLICITAÇÃO SENHA DO ADMIN */}
      {showAdminPrompt && (
         <div className="fixed inset-0 bg-[#040207]/90 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-in fade-in">
           <div className="luxury-panel p-6 rounded-xl w-full max-w-xs text-center border-[#FDA0FF]/30">
             <h3 className="font-cinzel font-bold text-[#FDA0FF] mb-2 uppercase tracking-widest text-sm">Acesso Restrito</h3>
             <p className="text-slate-400 text-xs mb-6 font-inter">Insira o PIN de Administrador</p>
             <input type="password" maxLength={4} autoFocus value={adminPin} onChange={e => setAdminPin(e.target.value)} className="w-full text-center text-2xl tracking-[1em] font-black bg-black/50 border border-[#FDA0FF]/30 text-white rounded-lg p-3 mb-6 outline-none focus:border-[#FDA0FF] shadow-[0_0_15px_rgba(253,160,255,0.1)]" placeholder="****" />
             <div className="flex gap-2 font-cinzel">
               <button onClick={() => {setShowAdminPrompt(false); setAdminPin('');}} className="flex-1 p-3 luxury-button text-slate-300 rounded-lg text-sm font-bold">Cancelar</button>
               <button onClick={handleAdminSubmit} className="flex-1 p-3 bg-[#FDA0FF]/20 text-[#FDA0FF] border border-[#FDA0FF]/50 rounded-lg text-sm font-bold">Entrar</button>
             </div>
           </div>
         </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-[#040207]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="luxury-panel p-6 rounded-2xl max-w-sm w-full border-red-500/30">
            <h3 className="text-xl font-cinzel font-bold text-white mb-2 flex items-center gap-2"><AlertCircle className="text-red-400" /> Resetar Banco?</h3>
            <p className="text-slate-400 mb-6 text-sm font-inter">Isso apagará TUDO para TODOS os usuários.</p>
            <div className="flex gap-3 font-cinzel">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 px-4 py-3 luxury-button text-slate-300 font-bold rounded-lg">Cancelar</button>
              <button onClick={handleReset} className="flex-1 px-4 py-3 bg-red-900/40 hover:bg-red-900/60 border border-red-500/50 text-white font-bold rounded-lg">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 bg-[#040207]/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
          <div className="luxury-panel p-6 rounded-2xl max-w-sm w-full text-center">
            <AlertCircle size={40} className="text-[#FDA0FF] mx-auto mb-4" />
            <p className="text-slate-300 mb-6 text-sm font-inter">{errorMessage}</p>
            <button onClick={() => setErrorMessage('')} className="w-full px-4 py-3 luxury-button text-white font-bold rounded-lg">Entendi</button>
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto p-4 font-inter relative z-10">
        
        {activeTab === 'draft' && (
          <div className="space-y-6 animate-in fade-in duration-300 pb-32">
            {safePlayers.map((player, pIndex) => (
              <div key={player.id} className={`luxury-panel rounded-xl overflow-hidden relative ${isAdmin ? 'admin-glow' : ''}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8CD3F5] via-slate-300 to-[#734078] opacity-70"></div>
                
                <div className="bg-black/40 p-4 border-b border-white/10 ml-1 relative">
                  <div className="absolute top-3 right-4 flex flex-col items-end gap-1">
                    <span className="text-[10px] text-slate-500 font-cinzel font-bold uppercase tracking-widest border border-white/10 rounded px-2 py-0.5 bg-black/50">Pick #{pIndex + 1}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${player.tradesUsed >= 3 ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                      {3 - (player.tradesUsed || 0)} Trocas Restantes
                    </span>
                  </div>
                  
                  <div className="space-y-3 pr-24">
                    {isAdmin ? (
                      <input type="text" value={player.name} onChange={(e) => handlePlayerChange(player.id, 'name', e.target.value)} className="w-full bg-transparent text-[#FDA0FF] font-cinzel font-bold text-lg outline-none border-b border-[#FDA0FF]/30 pb-1" />
                    ) : (
                      <div className="w-full text-white font-cinzel font-bold text-lg pb-1">{player.name}</div>
                    )}
                    
                    {isAdmin ? (
                      <input type="text" value={player.baseTeam || ''} onChange={(e) => handlePlayerChange(player.id, 'baseTeam', e.target.value)} className="w-full luxury-input rounded-lg px-3 py-1.5 text-slate-300 text-sm outline-none" placeholder="Time Base" />
                    ) : (
                      <div className="text-slate-400 text-sm">{player.baseTeam || 'Sem Time Base'}</div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 grid grid-cols-2 gap-2 ml-1">
                  {(player.picks || Array(18).fill('')).map((pick, idx) => (
                    <div key={idx} className="relative flex items-center group">
                      <span className="absolute left-2 text-[10px] font-bold text-slate-500">{idx + 1}</span>
                      
                      {isAdmin ? (
                        <input type="text" value={pick} onChange={(e) => handlePickChange(player.id, idx, e.target.value)} className="w-full bg-black/40 border border-[#FDA0FF]/20 rounded pl-7 pr-2 py-1.5 text-xs text-slate-200 outline-none focus:border-[#FDA0FF]" placeholder="Vazio..." />
                      ) : (
                        <div className="w-full bg-black/20 border border-white/5 rounded pl-7 pr-8 py-1.5 text-xs text-slate-300 font-medium truncate">{pick || '-'}</div>
                      )}

                      {!isAdmin && (
                        <button 
                          onClick={() => handleTradePlayer(player.id, idx, pick)}
                          className="absolute right-1 p-1 text-slate-500 hover:text-[#8CD3F5] hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Fazer Troca"
                        >
                          <RotateCcw size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-8 luxury-panel p-4 rounded-xl">
                <h3 className="text-sm font-cinzel font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wider"><Settings size={16}/> Gerenciamento de Dados</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <button onClick={exportTXT} className="flex flex-col items-center justify-center gap-2 luxury-button text-slate-300 text-xs py-3 px-2 rounded-lg transition-colors"><FileText size={16}/> Exportar TXT</button>
                    <button onClick={exportCSV} className="flex flex-col items-center justify-center gap-2 luxury-button text-slate-300 text-xs py-3 px-2 rounded-lg transition-colors"><Download size={16}/> Baixar CSV</button>
                    <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 bg-[#8CD3F5]/10 hover:bg-[#8CD3F5]/20 text-[#8CD3F5] border border-[#8CD3F5]/30 text-xs py-3 px-2 rounded-lg transition-colors"><Upload size={16}/> Subir CSV</button>
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImportCSV} className="hidden" />
                </div>
                <button onClick={exportHistoryJSON} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#734078]/20 to-[#8CD3F5]/20 hover:from-[#734078]/40 border border-white/10 text-white font-cinzel font-bold text-xs py-3 px-4 rounded-lg transition-colors shadow-lg">
                    <Database size={16}/> Exportar Histórico Completo (Backup JSON)
                </button>
            </div>
          </div>
        )}

        {activeTab === 'league' && (
          <div className="space-y-6 animate-in fade-in duration-300 pb-32">
            <div className="space-y-4">
              {safeMatches.map(match => (
                <div key={match.id} className={`luxury-panel rounded-xl p-4 transition-all ${match.isPlayed ? 'opacity-60 grayscale-[30%]' : 'border-[#8CD3F5]/30 shadow-[0_0_15px_rgba(140,211,245,0.05)]'} ${isAdmin ? 'admin-glow relative' : ''}`}>
                  
                  {isAdmin && editingMatchId !== match.id && (
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                      <button onClick={() => setEditingMatchId(match.id)} className="p-1.5 text-slate-400 hover:text-[#FDA0FF] bg-black/50 rounded"><Edit2 size={12}/></button>
                      <button onClick={() => handleDeleteMatch(match.id)} className="p-1.5 text-slate-400 hover:text-red-400 bg-black/50 rounded"><Trash2 size={12}/></button>
                    </div>
                  )}

                  <div className="text-[10px] font-cinzel font-bold text-slate-400 uppercase tracking-widest text-center mb-4">{match.round}</div>
                  
                  {editingMatchId === match.id ? (
                    <div className="flex flex-col gap-2">
                      <select onChange={(e) => handleEditMatchTeams(match.id, e.target.value, match.awayId)} value={match.homeId} className="luxury-input text-xs p-2 rounded">
                        {safePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <span className="text-center text-xs text-slate-500">X</span>
                      <select onChange={(e) => handleEditMatchTeams(match.id, match.homeId, e.target.value)} value={match.awayId} className="luxury-input text-xs p-2 rounded">
                        {safePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <button onClick={() => setEditingMatchId(null)} className="mt-2 luxury-button text-xs py-1 rounded">Concluir Edição</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 text-right overflow-hidden">
                        <div className="font-bold text-sm text-white truncate font-cinzel">{getPlayerName(match.homeId)}</div>
                      </div>
                      <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1 border border-white/10">
                        <input type="number" min="0" value={match.homeScore} onChange={(e) => handleMatchScore(match.id, true, e.target.value)} className="w-10 h-10 bg-transparent text-center font-black text-xl text-white focus:text-[#8CD3F5] outline-none" placeholder="-" />
                        <span className="text-slate-600 font-black">X</span>
                        <input type="number" min="0" value={match.awayScore} onChange={(e) => handleMatchScore(match.id, false, e.target.value)} className="w-10 h-10 bg-transparent text-center font-black text-xl text-white focus:text-[#8CD3F5] outline-none" placeholder="-" />
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <div className="font-bold text-sm text-white truncate font-cinzel">{getPlayerName(match.awayId)}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isAdmin && (
              <div className="pt-4 border-t border-[#FDA0FF]/30">
                {!isAddingMatch ? (
                  <button onClick={() => setIsAddingMatch(true)} className="w-full py-3 bg-[#FDA0FF]/10 text-[#FDA0FF] border border-[#FDA0FF]/30 text-sm font-cinzel font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2">
                    <Plus size={16} /> Adicionar Jogo Extra
                  </button>
                ) : (
                  <div className="luxury-panel p-4 rounded-xl space-y-4 border-[#FDA0FF]/30">
                    <h4 className="text-sm font-cinzel font-bold text-white uppercase tracking-widest text-center">Nova Partida</h4>
                    <div className="flex gap-2">
                      <select value={newMatchHome} onChange={(e) => setNewMatchHome(e.target.value)} className="flex-1 luxury-input rounded-lg p-2 text-sm outline-none truncate">
                        <option value="">Mandante...</option>{safePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <select value={newMatchAway} onChange={(e) => setNewMatchAway(e.target.value)} className="flex-1 luxury-input rounded-lg p-2 text-sm outline-none truncate">
                        <option value="">Visitante...</option>{safePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-2 font-cinzel">
                      <button onClick={() => setIsAddingMatch(false)} className="flex-1 p-2 luxury-button rounded-lg text-sm font-bold">Cancelar</button>
                      <button onClick={handleAddExtraMatch} className="flex-1 p-2 bg-[#FDA0FF]/20 text-[#FDA0FF] border border-[#FDA0FF]/50 rounded-lg text-sm font-bold">Confirmar</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tactics' && (
          <div className="space-y-6 animate-in fade-in duration-300 pb-32">
            <div className="luxury-panel rounded-xl p-4 space-y-4">
              <h2 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2"><ClipboardList size={20} className="text-[#8CD3F5]" /> Prancheta Tática</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <select value={tacticsTeamId} onChange={(e) => setTacticsTeamId(e.target.value)} className="w-full luxury-input rounded-lg px-3 py-2 text-sm outline-none truncate">
                    <option value="" disabled>Selecione um time...</option>
                    {safePlayers.map(p => <option key={p.id} value={p.id}>{p.name} {p.baseTeam ? `(${p.baseTeam})` : ''}</option>)}
                  </select>
                </div>
                {tacticsTeamId && (
                  <div className="flex-1">
                    <select value={state?.lineups?.[tacticsTeamId]?.formation || '4-3-3'} onChange={(e) => handleUpdateLineup(tacticsTeamId, e.target.value)} className="w-full luxury-input rounded-lg px-3 py-2 text-sm outline-none">
                      {Object.keys(FORMATIONS).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="relative w-full max-w-sm mx-auto aspect-[3/4] bg-transparent border border-white/20 rounded-lg overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-300 opacity-40 -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 border border-slate-300 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-slate-300 rounded-full opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-1/2 w-1/2 h-[15%] border border-slate-300 border-b-0 opacity-40 -translate-x-1/2 pointer-events-none"></div>
              <div className="absolute bottom-[15%] left-1/2 w-1/4 h-[8%] border border-slate-300 border-b-0 rounded-t-full opacity-40 -translate-x-1/2 pointer-events-none"></div>
              <div className="absolute top-0 left-1/2 w-1/2 h-[15%] border border-slate-300 border-t-0 opacity-40 -translate-x-1/2 pointer-events-none"></div>
              <div className="absolute top-[15%] left-1/2 w-1/4 h-[8%] border border-slate-300 border-t-0 rounded-b-full opacity-40 -translate-x-1/2 pointer-events-none"></div>
              {tacticsTeamId && FORMATIONS[state?.lineups?.[tacticsTeamId]?.formation || '4-3-3'].map((slot) => {
                const isSelected = selectingSlot?.formationIndex === slot.id;
                const pickedPlayer = state?.lineups?.[tacticsTeamId]?.players?.[slot.id];
                return (
                  <button key={slot.id} onClick={() => setSelectingSlot({ teamId: tacticsTeamId, formationIndex: slot.id })} style={{ top: slot.top, left: slot.left }} className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 ${isSelected ? 'scale-125 z-10' : 'z-0'}`}>
                    <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center bg-gradient-to-b from-[#8CD3F5] to-[#4092b8]"><span className="text-[9px] font-black text-[#040207]">{slot.label}</span></div>
                    <div className="mt-1 bg-black/80 backdrop-blur-sm border border-white/20 rounded px-2 py-0.5 text-[9px] font-bold text-slate-100 max-w-[70px] truncate">{pickedPlayer || 'Vazio'}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="space-y-4 animate-in fade-in duration-300 overflow-x-auto pb-32">
            <div className="min-w-[400px] luxury-panel rounded-xl overflow-hidden">
              <div className="grid grid-cols-11 gap-2 px-4 py-3 text-[10px] font-cinzel font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 bg-black/40">
                <div className="col-span-3">Equipe</div><div className="text-center text-[#8CD3F5]">Pts</div><div className="text-center">J</div><div className="text-center">V</div><div className="text-center">GP</div><div className="text-center">GC</div><div className="text-center">SG</div><div className="col-span-2 text-center">Forma</div>
              </div>
              {standings.map((team, i) => (
                <div key={team.id} className={`grid grid-cols-11 gap-2 px-4 py-3 items-center border-b border-white/5 hover:bg-white/5 ${i < 4 ? 'bg-[#8CD3F5]/5 border-l-2 border-l-[#8CD3F5]' : ''}`}>
                  <div className="col-span-3 flex items-center gap-3 overflow-hidden">
                    <span className={`text-xs font-cinzel font-bold w-4 ${i < 4 ? 'text-[#8CD3F5]' : 'text-slate-500'}`}>{i + 1}</span>
                    <div className="truncate"><div className="font-bold text-sm text-slate-200 truncate font-cinzel">{team.name}</div></div>
                  </div>
                  <div className="text-center font-black text-[#8CD3F5] text-sm">{team.pts}</div><div className="text-center text-xs text-slate-300">{team.played}</div><div className="text-center text-xs text-slate-300">{team.won}</div><div className="text-center text-xs text-slate-300">{team.gf}</div><div className="text-center text-xs text-slate-300">{team.ga}</div><div className="text-center text-xs font-bold text-white">{team.gd > 0 ? `+${team.gd}` : team.gd}</div>
                  <div className="col-span-2 flex items-center justify-center gap-0.5">
                    {team.form.length === 0 ? <span className="text-[10px] text-slate-500">-</span> : team.form.map((res, idx) => (
                      <span key={idx} className="text-[10px]" title={res === 'W' ? 'Vitória' : res === 'L' ? 'Derrota' : 'Empate'}>{res === 'W' ? '✅' : res === 'L' ? '❌' : '➖'}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {isAdmin && safeKnockout.length === 0 && (
              <button onClick={handleGenerateKnockout} className="w-full mt-6 py-4 bg-[#8CD3F5]/10 text-[#8CD3F5] border border-[#8CD3F5]/30 font-cinzel font-bold uppercase rounded-xl flex items-center justify-center gap-2"><Star size={20} /> Gerar Chaves (Top 4)</button>
            )}
          </div>
        )}

        {activeTab === 'knockout' && (
          <div className="space-y-8 animate-in fade-in duration-300 pb-32">
            {safeKnockout.length === 0 ? (
              <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-3 font-cinzel"><Medal size={40} className="opacity-50" /><p>As chaves finais ainda não foram geradas.</p></div>
            ) : (
              <>
                <div className="space-y-4">
                  <h3 className="text-sm font-cinzel font-bold text-white uppercase tracking-widest text-center border-b border-white/10 pb-2">Semifinais</h3>
                  {safeKnockout.filter(m => m.id.startsWith('sf')).map(match => (
                    <div key={match.id} className="luxury-panel rounded-xl p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 text-right overflow-hidden"><div className="font-bold text-sm text-slate-200 truncate font-cinzel">{getPlayerName(match.homeId)}</div></div>
                        <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1 border border-white/10">
                          <input type="number" min="0" value={match.homeScore} onChange={(e) => handleKnockoutScore(match.id, true, e.target.value)} className="w-10 h-10 bg-transparent text-center font-black text-xl text-white outline-none" placeholder="-" />
                          <span className="text-slate-600 font-black">X</span>
                          <input type="number" min="0" value={match.awayScore} onChange={(e) => handleKnockoutScore(match.id, false, e.target.value)} className="w-10 h-10 bg-transparent text-center font-black text-xl text-white outline-none" placeholder="-" />
                        </div>
                        <div className="flex-1 text-left overflow-hidden"><div className="font-bold text-sm text-slate-200 truncate font-cinzel">{getPlayerName(match.awayId)}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
                {safeKnockout.find(m => m.id === 'third') && (
                  <div className="space-y-4 opacity-70 mt-6">
                    <h3 className="text-xs font-cinzel font-bold text-slate-400 uppercase tracking-widest text-center border-b border-white/10 pb-2">Disputa 3º Lugar</h3>
                    {safeKnockout.filter(m => m.id === 'third').map(match => (
                       <div key={match.id} className="luxury-panel rounded-xl p-4">
                       <div className="flex items-center justify-between gap-2">
                         <div className="flex-1 text-right overflow-hidden"><div className="font-bold text-sm text-slate-300 truncate font-cinzel">{getPlayerName(match.homeId)}</div></div>
                         <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1 border border-white/10">
                           <input type="number" min="0" value={match.homeScore} onChange={(e) => handleKnockoutScore(match.id, true, e.target.value)} className="w-10 h-10 bg-transparent text-center font-black text-xl text-white outline-none" placeholder="-" />
                           <span className="text-slate-600 font-black">X</span>
                           <input type="number" min="0" value={match.awayScore} onChange={(e) => handleKnockoutScore(match.id, false, e.target.value)} className="w-10 h-10 bg-transparent text-center font-black text-xl text-white outline-none" placeholder="-" />
                         </div>
                         <div className="flex-1 text-left overflow-hidden"><div className="font-bold text-sm text-slate-300 truncate font-cinzel">{getPlayerName(match.awayId)}</div></div>
                       </div>
                     </div>
                    ))}
                  </div>
                )}
                {safeKnockout.find(m => m.id === 'final') && (
                  <div className="space-y-4 mt-8">
                    <h3 className="text-sm font-cinzel font-bold text-[#FDA0FF] uppercase tracking-widest text-center border-b border-[#FDA0FF]/30 pb-2 drop-shadow-md">Confronto Final</h3>
                    {safeKnockout.filter(m => m.id === 'final').map(match => (
                      <div key={match.id} className="luxury-panel border border-[#FDA0FF]/30 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FDA0FF]/10 via-transparent to-transparent pointer-events-none"></div>
                        <div className="flex items-center justify-between gap-2 relative z-10">
                          <div className="flex-1 text-right overflow-hidden"><div className="font-cinzel font-bold text-base text-white truncate">{getPlayerName(match.homeId)}</div></div>
                          <div className="flex items-center gap-2 bg-black/80 rounded-xl p-2 border border-[#FDA0FF]/50">
                            <input type="number" min="0" value={match.homeScore} onChange={(e) => handleKnockoutScore(match.id, true, e.target.value)} className="w-12 h-12 bg-transparent text-center font-black text-2xl text-white outline-none" placeholder="-" />
                            <span className="text-[#FDA0FF] font-black">X</span>
                            <input type="number" min="0" value={match.awayScore} onChange={(e) => handleKnockoutScore(match.id, false, e.target.value)} className="w-12 h-12 bg-transparent text-center font-black text-2xl text-white outline-none" placeholder="-" />
                          </div>
                          <div className="flex-1 text-left overflow-hidden"><div className="font-cinzel font-bold text-base text-white truncate">{getPlayerName(match.awayId)}</div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Modal Prancheta */}
      {selectingSlot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-end sm:items-center justify-center p-4 pb-0 sm:pb-4 animate-in fade-in">
          <div className="luxury-panel rounded-t-2xl sm:rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col border border-white/10">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-cinzel font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Users size={16} className="text-[#8CD3F5]" /> Designar Operador</h3>
              <button onClick={() => setSelectingSlot(null)} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 scrollbar-hide">
              <button onClick={() => handleUpdateLineup(selectingSlot.teamId, state?.lineups?.[selectingSlot.teamId]?.formation || '4-3-3', selectingSlot.formationIndex, null)} className="w-full text-left px-4 py-3 bg-red-900/20 text-red-300 hover:bg-red-900/40 rounded-lg mb-2 text-sm font-bold border border-red-500/30 transition-colors flex items-center gap-2 font-inter"><X size={14} /> Desocupar Posição</button>
              <div className="space-y-2 font-inter">
                {(safePlayers.find(p => p.id === selectingSlot.teamId)?.picks || []).filter(pick => pick.trim() !== '').map((pick, idx) => (
                  <button key={idx} onClick={() => handleUpdateLineup(selectingSlot.teamId, state?.lineups?.[selectingSlot.teamId]?.formation || '4-3-3', selectingSlot.formationIndex, pick)} className="w-full text-left px-4 py-3 luxury-input rounded-lg text-sm font-medium transition-colors truncate">{pick}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegação Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#040207]/90 backdrop-blur-2xl border-t border-white/10 pb-safe z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        <div className="max-w-md mx-auto flex justify-around p-1 sm:p-2">
          <button onClick={() => setActiveTab('draft')} className={`flex flex-col items-center gap-1 p-2 w-16 sm:w-20 rounded-lg transition-all ${activeTab === 'draft' ? 'text-[#8CD3F5]' : 'text-slate-500'}`}><Users size={20} /> <span className="text-[9px] font-cinzel font-bold uppercase tracking-wider">Base</span></button>
          <button onClick={() => setActiveTab('league')} className={`flex flex-col items-center gap-1 p-2 w-16 sm:w-20 rounded-lg transition-all ${activeTab === 'league' ? 'text-[#8CD3F5]' : 'text-slate-500'}`}><Gamepad2 size={20} /> <span className="text-[9px] font-cinzel font-bold uppercase tracking-wider">Partidas</span></button>
          <button onClick={() => setActiveTab('standings')} className={`flex flex-col items-center gap-1 p-2 w-16 sm:w-20 rounded-lg transition-all ${activeTab === 'standings' ? 'text-[#8CD3F5]' : 'text-slate-500'}`}><Trophy size={20} /> <span className="text-[8px] font-cinzel font-bold uppercase tracking-wider truncate w-full text-center">Classificação</span></button>
          <button onClick={() => setActiveTab('tactics')} className={`flex flex-col items-center gap-1 p-2 w-16 sm:w-20 rounded-lg transition-all ${activeTab === 'tactics' ? 'text-[#8CD3F5]' : 'text-slate-500'}`}><ClipboardList size={20} /> <span className="text-[9px] font-cinzel font-bold uppercase tracking-wider">Tática</span></button>
          <button onClick={() => setActiveTab('knockout')} className={`flex flex-col items-center gap-1 p-2 w-16 sm:w-20 rounded-lg transition-all ${activeTab === 'knockout' ? 'text-[#FDA0FF]' : 'text-slate-500'}`}><Star size={20} /> <span className="text-[9px] font-cinzel font-bold uppercase tracking-wider">Finais</span></button>
        </div>
      </nav>
    </div>
  );
}