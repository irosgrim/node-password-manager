import { log } from './helpers/logging';
import { app } from './server';
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => log.text(`server 🔥 on port ${PORT}`));
