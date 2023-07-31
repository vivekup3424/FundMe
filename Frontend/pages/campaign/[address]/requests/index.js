import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import PageLayout from "../../../../Components/PageLayout";
import RowComp from "../../../../Components/Row";
import camp from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
export default function index(props) {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    (async () => {
      const instance = await camp(props.address);
      const req = await Promise.all(
        Array(parseInt(props.reqCount))
          .fill()
          .map(async (ele, i) => {
            let u = await instance.methods.requests(i).call();
            return u;
          })
      );
      setRequests(req);
    })();
  }, []);

  const requestRows = () => {
    return requests.map((ele, index) => {
      return (
        <RowComp
          requests={ele}
          id={index}
          key={index}
          address={props.address}
        />
      );
    });
  };

  return (
    <PageLayout>
    <Link href={`/campaign/${props.address}`}>Back</Link>
      <Table celled structured striped textAlign="center" singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount(in eth)</Table.HeaderCell>
            <Table.HeaderCell>Recepient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{requestRows()}</Table.Body>
      </Table>
      <Link href={`/campaign/${props.address}/requests/new`}>
        <Button primary className="m-auto">
          Make a Request
        </Button>
      </Link>
    </PageLayout>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  const { address } = params;
  const instance = await camp(address);
  const size = await instance.methods.getNumRequests().call();
  return {
    props: {
      address: address,
      reqCount: size,
    },
  };
}
