import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { getPrintTable, getSingleTable, getTables, putFinishTable, putSaveToPdf, updateTable } from "../../api/table";
import { toast } from 'react-toastify';

const newRotaState = (initData) => {
  return {
    ...rotaInitState,
    name: initData.name,
    rescuers: initData.rescuers,
    inspection: {
      signals: false,
      air: false,
      lights: false,
      communication: false,
      equipment: false,
      entryReport: false,
    },
    avgPressureConsumption: [],
    alarmCanPlay: [false, false]
  }
}
const rotaInitState = {
  currentState: 1,
  name: '',

  timestamps: {
    IN: null,
    k: [
      null,
      null
    ],
    OUT: null,
    estimatedExitTime: null,
  },

}

export const fetchTables = createAsyncThunk('fetchTables', async () => {
  const response = await getTables()
  return response.data
})

export const fetchSingleTable = createAsyncThunk('fetchSingleTable',
  async (tableId, { dispatch }) => {
    const result = await getSingleTable(tableId)

    if (result.response && result.response.status === 404) {
      toast.error("Tabela, której szukasz nie istnieje.", {
        position: "bottom-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        theme: "light",
      })
      return result.response.status

    } else {
      await dispatch(setCurrentTable(
        result.data.id_table,
        result.data.name,
        result.data.created_at,
        result.data.location,
        result.data.user_creator_id,
        result.data.rota_list,
        result.data.finished,
        result.data.finished_at
      ))
    }
  })

export const finishTable = async (idTable) => {
  const reqData = { id: idTable }
  const response = await putFinishTable(reqData)
}

export const printTable = async (idTable) => {
  const response = await getPrintTable(idTable)
  const blob = new Blob([response.data], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  window.open(url, '_blank')
}

export const saveToPdf = async (idTable) => {
  const response = await putSaveToPdf(idTable)
}

export const tableSlice = createSlice({
  name: 'table',
  initialState: {
    tables: [],
    fetchedTable: [],
    currentTableId: null,

    table: {
      idTable: '',
      name: '',
      createdAt: null,
      location: '',
      idUser: null,
      rotaList: [],
      finished: 0,
      finishedAt: null
    },

  },

  reducers: {
    saveTable(state) {
      const reqTable = {
        id: state.table.idTable,
        name: state.table.name,
        location: state.table.location,
        rotaList: []
      }

      state.table.rotaList.map(rota => {
        const rotaElem = {
          currentState: rota.currentState,
          name: rota.name,
          inspection: rota.inspection,
          alarmCanPlay: rota.alarmCanPlay,
          avgPressureConsumption: rota.avgPressureConsumption,
          timestamps: {
            IN: rota.timestamps.IN,
            k: [],
            OUT: rota.timestamps.OUT,
            estimatedExitTime: rota.timestamps.estimatedExitTime
          },
          rescuers: [
            {
              rescuerId: rota.rescuers[0].rescuerId,
              name: rota.rescuers[0].name,
              IN: rota.rescuers[0].IN,
              k: [],
              OUT: rota.rescuers[0].OUT,
            },
            {
              rescuerId: rota.rescuers[1].rescuerId,
              name: rota.rescuers[1].name,
              IN: rota.rescuers[1].IN,
              k: [],
              OUT: rota.rescuers[1].OUT,
            },
          ]
        }
        rota.timestamps.k.forEach(elem => {
          rotaElem.timestamps.k.push(elem)
        })
        rota.rescuers[0].k.forEach(elem => {
          rotaElem.rescuers[0].k.push(elem)
        })
        rota.rescuers[1].k.forEach(elem => {
          rotaElem.rescuers[1].k.push(elem)
        })
        reqTable.rotaList.push(rotaElem)
      }
      )

      const response = updateTable(JSON.parse(JSON.stringify(reqTable)))
    },
    clearTable(state) {
      state.table.idTable = '',
        state.table.name = '',
        state.table.location = '',
        state.table.idUser = null,
        state.table.rotaList = [],
        state.table.createdAt = null,
        state.table.finished = 0,
        state.table.finishedAt = null
    },
    setCurrentTable: {
      reducer(state, action) {
        state.table.idTable = action.payload.idTable,
          state.table.name = action.payload.name,
          state.table.location = action.payload.location,
          state.table.idUser = action.payload.idUser,
          state.table.rotaList = action.payload.rotaList,
          state.table.createdAt = action.payload.createdAt,
          state.table.finished = action.payload.finished,
          state.table.finishedAt = action.payload.finishedAt

      },
      prepare(idTable, name, createdAt, location, idUser, rotaList, finished, finishedAt) {
        return {
          payload: {
            idTable,
            name,
            createdAt,
            location,
            idUser,
            rotaList,
            finished,
            finishedAt
          }
        }
      }
    },
    addRota: {
      reducer(state, action) {
        const ritExist = state.table.rotaList.some(rota => rota.name === 'RIT')
        if (!ritExist) {
          state.table.rotaList.push({
            ...newRotaState({
              name: action.payload.rotaName,
              rescuers: [
                {
                  rescuerId: action.payload.rescuer1Id,
                  name: action.payload.rescuer1Name,
                  IN: action.payload.rescuer1InPressure,
                  k: [null, null],
                  OUT: null,
                },
                {
                  rescuerId: action.payload.rescuer2Id,
                  name: action.payload.rescuer2Name,
                  IN: action.payload.rescuer2InPressure,
                  pp: null,
                  k: [null, null],
                  OUT: null,
                }
              ]
            })
          })
        } else if (ritExist) {
          state.table.rotaList.splice(state.table.rotaList.length - 1, 0, {
            ...newRotaState({
              name: action.payload.rotaName,
              rescuers: [
                {
                  rescuerId: action.payload.rescuer1Id,
                  name: action.payload.rescuer1Name,
                  IN: action.payload.rescuer1InPressure,
                  k: [null, null],
                  OUT: null,
                },
                {
                  rescuerId: action.payload.rescuer2Id,
                  name: action.payload.rescuer2Name,
                  IN: action.payload.rescuer2InPressure,
                  k: [null, null],
                  OUT: null,
                }
              ]
            })
          })
        }

      },
      prepare(rotaName, rescuer1Name, rescuer1InPressure, rescuer2Name, rescuer2InPressure, rescuer1Id, rescuer2Id) {
        return {
          payload: {
            rotaName,
            rescuer1Name,
            rescuer1InPressure,
            rescuer2Name,
            rescuer2InPressure,
            rescuer1Id,
            rescuer2Id
          }
        }
      }
    },
    removeRota(state, action) {
      const ritExist = state.table.rotaList.some(rota => rota.name === 'RIT')
      const ritIsSelected = action.payload === 'RIT'
      if (!ritExist) {
        state.table.rotaList = state.table.rotaList.filter(rota => rota.name !== action.payload)
        state.table.rotaList = state.table.rotaList.map((rota, index) => ({
          ...rota,
          name: `R${index + 1}`
        }))
      } else if (ritExist && !ritIsSelected) {
        state.table.rotaList = state.table.rotaList.filter(rota => rota.name !== action.payload)
        state.table.rotaList = state.table.rotaList.map((rota, index) => ({
          ...rota,
          name: `R${index + 1}`
        }))
        state.table.rotaList[state.table.rotaList.length - 1].name = "RIT"
      } else if (ritExist && ritIsSelected) {
        state.table.rotaList = state.table.rotaList.filter(rota => rota.name !== action.payload)
      }
    },
    trimUnusedK(state, action) {
      const timestampK = state.table.rotaList[action.payload].timestamps.k.filter((k) => k !== null)
      const pressureOneK = state.table.rotaList[action.payload].rescuers[0].k.filter((k) => k !== null)
      const pressureTwoK = state.table.rotaList[action.payload].rescuers[1].k.filter((k) => k !== null)

      while (timestampK.length < 2) {
        timestampK.push(null)
        pressureOneK.push(null)
        pressureTwoK.push(null)
      }
      state.table.rotaList[action.payload].timestamps.k = timestampK
      state.table.rotaList[action.payload].rescuers[0].k = pressureOneK
      state.table.rotaList[action.payload].rescuers[1].k = pressureTwoK
    },
    rotaTimeIn(state, action) {
      state.table.rotaList[action.payload].timestamps.IN = dayjs().unix()
      state.table.rotaList[action.payload].currentState++
    },
    rotaTimeK: {
      reducer(state, action) {
        state.table.rotaList[action.payload.indexRota].timestamps.k[action.payload.indexK] = dayjs().unix()
      },
      prepare(indexRota, indexK) {
        return {
          payload: {
            indexRota,
            indexK
          }
        }
      }
    },
    rotaTimeOut(state, action) {
      state.table.rotaList[action.payload].timestamps.OUT = dayjs().unix()
      state.table.rotaList[action.payload].currentState++
    },
    rotaPressureK: {
      reducer(state, action) {
        state.table.rotaList[action.payload.indexRota].rescuers[action.payload.indexRescuer].k[action.payload.indexK] = action.payload.pressure

      },
      prepare(indexRota, indexRescuer, indexK, pressure) {
        return {
          payload: {
            indexRota,
            indexRescuer,
            indexK,
            pressure
          }
        }
      }
    },
    rotaPressureOut: {
      reducer(state, action) {
        state.table.rotaList[action.payload.indexRota].rescuers[action.payload.indexRescuer].OUT = action.payload.pressure

      },
      prepare(indexRota, indexRescuer, pressure) {
        return {
          payload: {
            indexRota,
            indexRescuer,
            pressure
          }
        }
      }
    },
    rotaAddK: {
      reducer(state, action) {
        state.table.rotaList[action.payload.indexRota].timestamps.k.push(null)
        state.table.rotaList[action.payload.indexRota].rescuers[0].k.push(null)
        state.table.rotaList[action.payload.indexRota].rescuers[1].k.push(null)
      },
      prepare(indexRota) { return { payload: { indexRota } } }
    },

    rotaExitTime: {
      reducer(state, action) {
        state.table.rotaList[action.payload.indexRota].timestamps.estimatedExitTime = action.payload.countedExitTime
      },
      prepare(indexRota, countedExitTime) {
        return {
          payload: {
            indexRota,
            countedExitTime
          }
        }
      }
    },
    updateInspection: {
      reducer(state, action) {
        state.table.rotaList[action.payload.indexRota].inspection[action.payload.selectedInspection] = action.payload.inspectionStatus
      },
      prepare(indexRota, selectedInspection, inspectionStatus) {
        return {
          payload: {
            indexRota,
            selectedInspection,
            inspectionStatus
          }
        }
      }
    },
    updateAlarmCanPlay(state, action) {
      state.table.rotaList.forEach((rota, index) => {
        rota.alarmCanPlay = action.payload[index]
      })
    },
    addAvgPressureConsumption: {
      reducer(state, action) {
        state.table.rotaList[action.payload.indexRota].avgPressureConsumption.push(action.payload.pressureConsumption)
      },
      prepare(indexRota, pressureConsumption) {
        return {
          payload: {
            indexRota,
            pressureConsumption
          }
        }
      }
    }

  },
  extraReducers: (builder) => {
    builder.addCase(fetchTables.fulfilled, (state, action) => {
      state.tables = action.payload
    })
    builder.addCase(fetchSingleTable.fulfilled, (state, action) => {
      state.fetchedTable = action.payload
    })
  }
})

export const { rotaTimeIn, rotaTimePp, rotaTimeK, rotaTimeOut, rotaPressurePp, rotaPressureK, rotaPressureOut, addRota, removeRota, setCurrentTable, saveTable, clearTable, rotaAddK, rotaExitTime, updateInspection, updateAlarmCanPlay, addAvgPressureConsumption, trimUnusedK } = tableSlice.actions

export default tableSlice.reducer

//zaaktualizowac

//Stany Roty Opis
// 1 rota dodana do tabelki, przed wejściem do pożaru, możliwe zrobienie kontroli przed wejściem
// 2 rota weszła do pożaru, pojawia się możliwość dodania kontroli oraz wyjścia z pożaru
// 3 rota wychodzi z pożaru po kliknieciu przycisku wyjście
