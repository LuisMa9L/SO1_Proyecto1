package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
	"time"

	socketio "github.com/googollee/go-socket.io"
)

func main() {
	server, err := socketio.NewServer(nil)

	if err != nil {
		log.Fatal(err)
	}

	//sockets
	server.OnConnect("/", func(so socketio.Conn) error {
		so.SetContext("")
		so.Join("chat_room")
		fmt.Println("nuevo usuario conectado")

		return nil
	})

	server.OnEvent("/", "chat message", func(so socketio.Conn, msg string) {

		server.BroadcastToRoom("", "chat_room", "chat message", msg)
		//	so.Emit("chat message", msg+":v")
	})

	go server.Serve()
	defer server.Close()

	go thread(server)

	//Modulo Http
	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./public")))
	log.Println("Server on Port 3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func thread(server *socketio.Server) {

	for {

		nombreArchivo := "/proc/meminfo"
		bytesLeidos, err := ioutil.ReadFile(nombreArchivo)
		if err != nil {
			fmt.Printf("Error leyendo archivo: %v", err)
		}

		contenido := string(bytesLeidos)
		//fmt.Printf("El contenido del archivo es:\n%s", contenido)
		vectord := strings.Split(contenido, "\n")

		ramDisponible := strings.Replace((vectord[2])[15:len(vectord[2])-2], " ", "", -1)
		ramLibre := strings.Replace((vectord[1])[10:len(vectord[1])-2], " ", "", -1)

		disponible, err1 := strconv.Atoi(ramDisponible)
		libre, err2 := strconv.Atoi(ramLibre)
		enUso := 0

		if err1 == nil && err2 == nil {
			disponible = disponible / 1024
			libre = libre / 1024
			enUso = disponible - libre
		}
		/////-----
		out, err := exec.Command("mpstat").Output()
		if err != nil {
			log.Fatal(err)
		}
		salida := fmt.Sprintf("%s", out)
		vectorcpu := strings.Split(salida, "\n")
		cpuLibre := (vectorcpu[3])[len(vectorcpu[3])-6:]
		//fmt.Printf("The date is.............> %s\n", (vectorcpu[3])[len(vectorcpu[3])-6:])
		///-------
		fmt.Print(enUso)
		server.BroadcastToRoom("", "chat_room", "chat message", cpuLibre, ramLibre, ramDisponible)
		fmt.Println("Este es el hilo número")
		time.Sleep(1 * time.Second)
	}
	//Para simular una carga de trabajo
	//dormimos el programa x cantidad de segundo
	//donde x puede ir de x a 100

}
