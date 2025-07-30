import { Container, Title, Center } from '@mantine/core'
import WeekSchedule from '../../components/WeekSchedule/WeekSchedule'
import { useState } from 'react'
import { DateTimePicker } from '@mantine/dates'

const data = [[
  {
    dateFrom: "2025-06-08T22:30:00.000+00:00",
    dateTo: "2025-06-09T08:30:00.000+00:00"
  },
  {
    dateFrom: "2025-06-10T10:00:00.000+00:00",
    dateTo: "2025-06-11T13:00:00.000+00:00"
  },
  {
  dateFrom: "2025-06-13T17:00:00.000+00:00",
  dateTo: "2025-06-14T05:00:00.000+00:00"
  },
  {
  dateFrom: "2025-06-14T20:00:00.000+00:00",
  dateTo: "2025-06-15T10:00:00.000+00:00"
  },
],
[
  {
    dateFrom: "2025-07-07T08:30:00.000+00:00",
    dateTo: "2025-07-07T15:30:00.000+00:00"
  },
  {
    dateFrom: "2025-07-09T05:00:00.000+00:00",
    dateTo: "2025-07-09T17:00:00.000+00:00"
  },
  {
    dateFrom: "2025-07-11T13:00:00.000+00:00",
    dateTo: "2025-07-13T05:00:00.000+00:00"
  },
]]

const Home = () => {
  const [selectData, setSelectData] = useState({})
  return (
    <Container>
      <Container style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '50px' }}>
        <DateTimePicker onChange={(e) => {setSelectData({...selectData ,dateFrom: e });console.log(selectData)}} />
        <DateTimePicker onChange={(e) => {setSelectData({...selectData ,dateTo: e });console.log(selectData)}} />
      </Container>
      
      <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'space-between' }}>
        <div style={{width: "370px", padding: "5px", margin: "15px"}}><WeekSchedule showDay data={{dateFrom: "2025-06-29T13:00:00.000+00:00",dateTo: "2025-06-28T05:00:00.000+00:00"}}/></div>
        <div style={{width: "370px", padding: "5px", margin: "15px"}}><WeekSchedule showMonth data={data[1]}/></div>
        <div style={{width: "370px", padding: "5px", margin: "15px"}}><WeekSchedule showMonth showDay data={[{dateFrom: "2025-07-29T13:00:00.000+00:00",dateTo: "2025-07-30T05:00:00.000+00:00"},{dateFrom: "2025-08-01T18:00:00.000+00:00",dateTo: "2025-08-02T08:00:00.000+00:00"}]} tdata={[{dateFrom: "2025-07-29T10:00:00.000+00:00",dateTo: "2025-07-29T16:00:00.000+00:00"},{dateFrom: "2025-07-31T15:00:00.000+00:00",dateTo: "2025-08-01T06:00:00.000+00:00"}]}/></div>
      </Container>

       <div className={`dark:bg-card-dark m-auto w-full max-w-5xl rounded-xl bg-white p-3 drop-shadow-md lg:p-6 min-w-min`}>
       <Center>

          <div className="mt-5 w-full max-w-lg">

            <WeekSchedule data={data[1]} tdata={selectData} />

          </div>

        </Center>
    </div>
    </Container>
  )
}

export default Home
