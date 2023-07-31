import React, { useState } from "react";
import PageLayout from "../../../Components/PageLayout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import instance from "../../../ethereum/factory";
import Router from "next/router";
export default function New() {
  const handleclick = async (event) => {
    event.preventDefault();
    try {
        setload(true)
        if(!value)
        throw Error("Minimum Contribution needs to be greater than 0")
      const accounts = await web3.eth.getAccounts();
      await instance.methods.createCampaign(value).send({ from: accounts[0] });
      Router.push('/')
    } catch (e) {
      setload(false);
      seterr(e.message);
    }
  };
  const [value, setvalue] = useState(0);
  const [load, setload] = useState(false);
  const [err, seterr] = useState("");
  const onDismiss=()=>{
    seterr('')
    setload(false);
  }
  return (
    <PageLayout>
      <h3>Create a New Campaign </h3>
      <Form onSubmit={handleclick}>
        <Form.Field>
          <Input
            fluid
            placeholder="Minimum Contribution"
            label="wei"
            type="Number"
            min="0"
            labelPosition="right"
            value={value}
            onChange={(e) => {
              setvalue(e.target.value);
            }}
          />
        </Form.Field>
        <Button type="submit" loading={load}>Create</Button>
      </Form>
      {
        err?<Message
        negative
        header="Oops! An Error was encountered"
        content={err}
        onDismiss={onDismiss}
      />:''
      }
      
    </PageLayout>
  );
}
