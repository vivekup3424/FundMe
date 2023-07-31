import React, { useEffect, useState } from "react";
import PageLayout from "../../../../Components/PageLayout";
import { Form, Message, Icon, Label, Input, Button } from "semantic-ui-react";
import camp from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import Link from "next/link";
export default function New(props) {
  const [err, seterr] = useState("");
  const [desc, setdesc] = useState("");
  const [value, setvalue] = useState(0);
  const [rec, setrec] = useState("");
  const [load, setload] = useState(true);
  const onDismiss = () => {
    seterr("");
    setvalue(0);
    setload(true);
  };
  const submit = async (event) => {
    event.preventDefault();
    try {
      seterr("");
      setload(false);
      if (!rec || !desc || !value) throw Error("Please fill all Entries");
      const acc = await web3.eth.getAccounts();
      //(props.currentCamp)
      const instance = await camp(props.currentCamp);
      await instance.methods
        .createRequest(desc, web3.utils.toWei(value.toString(), "ether"), rec)
        .send({
          from: acc[0],
        });
      alert("Request registered successfully");
      setdesc("");
      setvalue(0);
      setrec("");
      setload(true);
    } catch (err) {
      setload(true);
      seterr(err.message);
    }
  };
  return (
    <PageLayout>
      <Link href={`/campaign/${props.currentCamp}/requests`}>Back</Link>
      <h1>Make Request</h1>
      <h3 className="content-center">
        <u>Balance of Contract: {props.balance} eth</u>
      </h3>
      <Form onSubmit={submit} error={!!err}>
        <Form.Field>
          <Label style={{ marginBottom: "10px" }}>Description</Label>
          <Input
            fluid
            labelPosition="right"
            placeholder="Description of request"
            value={desc}
            onChange={(eve) => {
              setdesc(eve.target.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <Label style={{ marginBottom: "10px" }}>Value in eth</Label>
          <Input
            placeholder="Value in ether"
            label="eth"
            type="Number"
            min="0"
            max={props.balance}
            step="0.001"
            labelPosition="right"
            value={value}
            fluid
            onChange={(e) => {
              setvalue(e.target.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <Label style={{ marginBottom: "10px" }}>Recepient</Label>
          <Input
            fluid
            labelPosition="right"
            placeholder="Recepient"
            value={rec}
            label="hex address"
            onChange={(eve) => {
              setrec(eve.target.value);
            }}
          />
        </Form.Field>
        <Button type="submit" primary>
          Create
        </Button>
        <Message
          error={true}
          header="Oops! An Error was Encountered"
          content={err}
          onDismiss={onDismiss}
        />
      </Form>
      <Message icon hidden={load}>
        <Icon name="sync alternate" loading />
        <Message.Content>
          <Message.Header>Your request is being processed</Message.Header>
          Please wait...
        </Message.Content>
      </Message>
    </PageLayout>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  const { address } = params;
  const balanceinWei = await web3.eth.getBalance(address);
  const balance = await web3.utils.fromWei(balanceinWei, "ether");
  return {
    props: {
      currentCamp: address,
      balance,
    },
  };
}
