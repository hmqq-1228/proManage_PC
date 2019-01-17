import Vue from 'vue'
import Router from 'vue-router'
import Test from '@/components/Test'
import HelloWorld from '@/components/HelloWorld'
import TaskPlan from '@/components/TaskPlan'
import TaskPlan2 from '@/components/TaskPlan2'
import taskDetailPage from '@/components/taskDetailPage'
import ProDetails from '@/components/proDetails'
import NewAddPro from '@/components/NewAddPro'
import addProlemList from '@/components/addProlemList'
import modelAddProject from '@/components/modelAddProject'
import addProblemDetail from '@/components/addProblemDetail'
import Schedule from '@/components/Schedule'
import ScheduleNew from '@/components/ScheduleNew'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test
    },
    {
      path: '/',
      name: 'TaskPlan',
      component: TaskPlan
    },
    {
      path: '/TaskPlan2',
      name: 'TaskPlan2',
      component: TaskPlan2
    },
    {
      path: '/taskDetailPage/:planid',
      name: 'taskDetailPage',
      component: taskDetailPage
    },
    {
      path: '/ProDetails/:pid',
      name: 'ProDetails',
      component: ProDetails
    },
    {
      path: '/NewAddPro',
      name: 'NewAddPro',
      component: NewAddPro
    },
    {
      path: '/addProlemList',
      name: 'addProlemList',
      component: addProlemList
    },
    {
      path: '/addProblemDetail/:planid',
      name: 'addProblemDetail',
      component: addProblemDetail
    },
    {
      path: '/modelAddProject/:modelId',
      name: 'modelAddProject',
      component: modelAddProject
    },
    {
      path: '/Schedule',
      name: 'Schedule',
      component: Schedule
    },
    {
      path: '/ScheduleNew',
      name: 'ScheduleNew',
      component: ScheduleNew
    }
  ]
})
