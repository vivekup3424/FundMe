import React, { useEffect, useState } from "react";
import { Table, Button, Popup } from "semantic-ui-react";
import web3 from "./../ethereum/web3";
import camp from "../ethereum/campaign";
import Router from "next/router";
export default function RowComp(props) {
  let instance;
  const [isallowed1, setallow1] = useState(false);
  const [isallowed2, setallow2] = useState(false);
  let account;
  useEffect(() => {
    (async () => {
     try{ instance = await camp(props.address);
      account = await web3.eth.getAccounts();
      setallow1(await instance.methods.isContributor(account[0]).call());
      setallow2(
        await instance.methods
          .hasAlreadyApproved(props.id)
          .call({ from: account[0] })
      );}
      catch(e)
      {
        alert("Successfully connected to a web3 wallet")
      }
    })();
  }, [instance, isallowed2, isallowed1, account]);

  const onApprove = async () => {
    const acc = await web3.eth.getAccounts();
    await instance.methods.approveRequest(props.id).send({
      from: acc[0],
    });
    Router.reload();
  };

  const onFinalize = async () => {
    const acc = await web3.eth.getAccounts();
    await instance.methods.finalizeRequest(props.id).send({
      from: acc[0],
    });
    Router.reload();
  };

  const style = {
    borderRadius: "0.4rem",
    backgroundColor: "black",
    opacity: 0.9,
    color: "white",
    padding: "1em",
  };

  const { Row, Cell } = Table;
  const { id, requests, address } = props;
  return (
    <Popup
      style={style}
      content="Congrats!!🥳 Request Finalized."
      disabled={!requests.complete}
      trigger={
        <Row
          positive={requests.complete}
          disabled={!requests.complete && !isallowed1}
        >
          <Cell>{id + 1}</Cell>
          <Cell>{requests.description}</Cell>
          <Cell>{web3.utils.fromWei(requests.value, "ether")}</Cell>
          <Cell>{requests.recipient}</Cell>
          <Cell>{requests.Numberofapprovals}</Cell>
          <Cell>
            {requests.complete ? null : !isallowed1 ? (
              <p>You are not an Approver </p>
            ) : isallowed2 ? (
              <p>You have Already Approved this request </p>
            ) : (
              <Button color="green" basic onClick={onApprove}>
                Approve
              </Button>
            )}
          </Cell>
          <Cell>
            {requests.complete ? null : !isallowed1 ? (
              <p>You are not an Approver </p>
            ) : (
              <Button color="teal" basic onClick={onFinalize}>
                Finalize
              </Button>
            )}
          </Cell>
        </Row>
      }
    ></Popup>
  );
}
