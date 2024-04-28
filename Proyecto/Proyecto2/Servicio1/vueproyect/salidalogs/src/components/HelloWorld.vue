<template>
  <div>
    <p>Logs console - SO1 - 201314439</p>
    <button @click="fetchLogs">Obtener últimos 20 logs</button>
    <ul>
      <li v-for="log in logs" :key="log._id">
        <p>Fecha: {{ log.fecha }} Hora: {{ log.hora }} Dato: {{ log.dato }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      logs: [],
    };
  },
  methods: {
    async fetchLogs() {
      try {
        const response = await axios.get(
          "https://servicio-api-nodejs-7peql66vaq-uc.a.run.app/logs"
        );
        this.logs = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
