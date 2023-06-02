import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form
} from 'semantic-ui-react'

import { createAgenda, deleteAgenda, getAgendas, patchAgenda } from '../api/agendas-api'
import Auth from '../auth/Auth'
import { Agenda } from '../types/Agenda'

interface AgendasProps {
  auth: Auth
  history: History
}

interface AgendasState {
  agendas: Agenda[]
  newAgendaTopic: string
  newDescription: string
  loadingAgendas: boolean
}

export class Agendas extends React.PureComponent<AgendasProps, AgendasState> {
  state: AgendasState = {
    agendas: [],
    newAgendaTopic: '',
    newDescription: '',
    loadingAgendas: true
  }

  handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAgendaTopic: event.target.value })
  }

  hideBrokenImage = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.visibility = "hidden";
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (agendaId: string) => {
    this.props.history.push(`/agendas/${agendaId}/edit`)
  }

  onAgendaCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newAgenda = await createAgenda(this.props.auth.getIdToken(), {
        topic: this.state.newAgendaTopic,
        description: this.state.newDescription,
        dueDate
      })
      this.setState({
        agendas: [...this.state.agendas, newAgenda],
        newAgendaTopic: '',
        newDescription:''
      })
    } catch {
      alert('Agenda creation failed')
    }
  }

  onAgendaDelete = async (agendaId: string) => {
    try {
      await deleteAgenda(this.props.auth.getIdToken(), agendaId)
      this.setState({
        agendas: this.state.agendas.filter(agenda => agenda.agendaId !== agendaId)
      })
    } catch {
      alert('Agenda deletion failed')
    }
  }

  onAgendaCheck = async (pos: number) => {
    try {
      const agenda = this.state.agendas[pos]
      await patchAgenda(this.props.auth.getIdToken(), agenda.agendaId, {
        topic: agenda.topic,
        description: agenda.description,
        dueDate: agenda.dueDate,
        complete: !agenda.complete
      })
      this.setState({
        agendas: update(this.state.agendas, {
          [pos]: { complete: { $set: !agenda.complete } }
        })
      })
    } catch {
      alert('Agenda deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const agendas = await getAgendas(this.props.auth.getIdToken())
      this.setState({
        agendas,
        loadingAgendas: false
      })
    } catch (e) {
      alert(`Failed to fetch agendas: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">AGENDAs</Header>

        {this.renderCreateAgendaInput()}

        {this.renderAgendas()}
      </div>
    )
  }

  renderCreateAgendaInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Form onSubmit={this.onAgendaCreate}>
            <Input
              action={{
                color: 'teal',
                labelPosition: 'left',
                icon: 'add',
                content: 'New Agenda',
              }}
              fluid
              actionPosition="left"
              placeholder="Serverless Course"
              onChange={this.handleTopicChange}
            />
            <Input
              action={{
                color: 'teal',
                labelPosition: 'left',
                icon: 'add',
                content: 'Description',
              }}
              fluid
              actionPosition="left" 
              placeholder="Meeting on zoom at link ..."
              onChange={this.handleDescriptionChange}
              
            />
            <Button type= 'submit'>Create</Button>
          </Form>
          
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderAgendas() {
    if (this.state.loadingAgendas) {
      return this.renderLoading()
    }

    return this.renderAgendasList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading AGENDAs
        </Loader>
      </Grid.Row>
    )
  }

  renderAgendasList() {
    return (
      <Grid padded>
        {this.state.agendas.map((agenda, pos) => {
          return (
            <Grid.Row key={agenda.agendaId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onAgendaCheck(pos)}
                  checked={agenda.complete}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                <h3>{agenda.topic}</h3>
                <p>{agenda.description}</p>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {agenda.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(agenda.agendaId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onAgendaDelete(agenda.agendaId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {agenda.attachmentUrl && (
                <Image 
                  src={agenda.attachmentUrl} 
                  size="small" 
                  onError= { this.hideBrokenImage } 
                  wrapped 
                />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
