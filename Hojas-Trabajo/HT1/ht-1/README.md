# README

# Hoja de Trabajo No. 1 SO1

---

---

Acontinuacion se tendra el desarrollo de la Hoja de Trabajo No. 1 de SO1

## Video de Demostración de Modulo :movie_camera:

### Enlace al Video con Miniatura

[![Miniatura del Video(hacer click en la imagen)](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Hojas-Trabajo/HT1/ht-1/Img/4.gif)](https://www.youtube.com/watch?v=N4j2xzdITHM)

### otros-Links :link:

1. [Enunciado de la Tarea](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Hojas-Trabajo/HT1/ht-1/Img/SO1_HT1_1S2024.pdf)
2. [Link de Video(por si no fuciona el de arriba)](https://www.youtube.com/watch?v=N4j2xzdITHM)

---

---

## Comandos utilizados en el ram.c nuevos

```javascript
//Para crear nuestro json
seq_printf(archivo, '{ \n \t"memoria_libre": %lu,\n', si.freeram);
seq_printf(archivo, ' \t"memoria_ocupada": %lu,\n', si.totalram - si.freeram);
seq_printf(archivo, ' \t"memoria_total": %lu\n}', si.totalram);
```

![Creacion de make](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/feature-wails/Hojas-Trabajo/HT1/ht-1/Img/1.gif)

### Ejecucion del archivo build

![Ejecucion de build](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/feature-wails/Hojas-Trabajo/HT1/ht-1/Img/2.gif)

---

---

### Quitando el archivo

![Ejecucion de rm](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Hojas-Trabajo/HT1/ht-1/Img/3.gif)

---

---

## Extra

## About

This is the official Wails React template.

You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.
