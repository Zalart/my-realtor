import React from 'react';
import { PDFDownloadLink, Document, Page, View, Text} from '@react-pdf/renderer';
const { v4: uuidv4 } = require('uuid');


const MyDoc = ({listing}) => {
    console.log(listing);
    return (
    <Document>
       <Document>
        <Page size="A4">
          <View>
            <Text>
              Name: 
            </Text>
            <Text>Email: </Text>
          </View>
        </Page>
      </Document>
    </Document>
    )
};
  
  const PdfRenderer = ({listing}) => (
    <div>
      <PDFDownloadLink document={<MyDoc listing={listing} /> } fileName= {`${uuidv4()}.pdf`}>
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download now!'
        }
      </PDFDownloadLink>
    </div>
  );

  export default PdfRenderer;
  