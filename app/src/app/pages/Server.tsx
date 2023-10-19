import { Server } from "../components/List.js";
import { Card, Page, Layout, Spinner } from "@shopify/polaris";
import { TitleBar } from "../AppBridge.js";
import { Suspense } from "react";

export default function ServerPage() {
  return (
    <Page>
      <TitleBar title="With server" />
      <Layout>
        <Card>
          <Suspense fallback={<Spinner />}>
            {/*@ts-ignore*/}
            <Server />
          </Suspense>
        </Card>
      </Layout>
    </Page>
  );
}
