import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { Layout } from './Layout';
import { Start } from '../screens/Start';
import { Waldkarte } from '../screens/Waldkarte';
import { StationScreen } from '../screens/Station';
import { Waldbuch } from '../screens/Waldbuch';
import { MeinWald } from '../screens/MeinWald';
import { Stationenzettel } from '../screens/Stationenzettel';
import { AbzeichenScreen } from '../screens/Abzeichen';
import { Wimmelbilder } from '../screens/Wimmelbilder';
import { Werkstatt } from '../screens/Werkstatt';
import { Eltern } from '../screens/Eltern';
import { Tagesaufgabe } from '../screens/Tagesaufgabe';
import { Urkunde } from '../screens/Urkunde';
import { DevAssets, DevFakten } from '../screens/Dev';

export function App() {
  const spieler = useProgress((s) => s.spieler);
  return (
    <HashRouter>
      <Routes>
        <Route path="/start" element={<Start />} />
        <Route path="/urkunde" element={<Urkunde />} />
        <Route path="/dev/assets" element={<DevAssets />} />
        <Route path="/dev/fakten" element={<DevFakten />} />
        <Route element={spieler ? <Layout /> : <Navigate to="/start" replace />}>
          <Route path="/" element={<Waldkarte />} />
          <Route path="/station/:id" element={<StationScreen />} />
          <Route path="/station/:id/spiel/:nr" element={<StationScreen />} />
          <Route path="/waldbuch" element={<Waldbuch />} />
          <Route path="/meinwald" element={<MeinWald />} />
          <Route path="/zettel" element={<Stationenzettel />} />
          <Route path="/abzeichen" element={<AbzeichenScreen />} />
          <Route path="/wimmelbilder" element={<Wimmelbilder />} />
          <Route path="/wimmelbilder/:id" element={<Wimmelbilder />} />
          <Route path="/werkstatt" element={<Werkstatt />} />
          <Route path="/tagesaufgabe" element={<Tagesaufgabe />} />
          <Route path="/eltern" element={<Eltern />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
