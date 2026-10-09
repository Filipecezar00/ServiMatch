import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState } from "../types/auth";
import {io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../config/env";

export const useAuthStore = create<AuthState>()(
  persist(
    (set,get) => ({
      usuario: null,
      token: null,
      socket: null,

      login: (usuario, token) => {set({usuario,token}); get().connectSocket()},
      logout: () => {get().disconnectSocket(); set({usuario:null,token:null})},
      connectSocket:()=> {
        const {token,socket} = get(); 
        if(!token || socket?.connected) return 

        const newSocket = io(API_CONFIG.BASE_URL,{
          auth:{token:`Bearer ${token}`},
        })
        set({socket:newSocket}); 
      },  
      disconnectSocket:()=> {
        const {socket} = get(); 
        if(socket){
          socket.disconnect(); 
          set({socket:null}); 
        }
      }
    }),
     
    {
      name: "@auth_store",
      storage: createJSONStorage(() => AsyncStorage),

      partialize:(state)=>({
        usuario:state.usuario,
        token:state.token,
      }),
      onRehydrateStorage:()=>{
        return (hydratedState)=>{
          if(hydratedState && hydratedState.token){
            hydratedState.connectSocket()
          }
        }
      }
    },
  ),
);
