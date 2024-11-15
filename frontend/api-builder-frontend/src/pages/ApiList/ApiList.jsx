import React, { useState, useEffect } from 'react';
import './ApiList.scss';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { getAllAPIUrls } from '../../services/get-table-apis-service';
import { getAllTablesList } from '../../services/get-all-tables-list';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the ExpandMoreIcon


const ApiList = () => {
  const [apiList, setApiList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const tablesList = await getAllTablesList(userId);
        console.log('tables list', tablesList)
      const apiListPromises = tablesList.map(async (table) => {
        const apiUrlData = await getAllAPIUrls(userId, table.database_name);
        return { table: table.database_name, apis: apiUrlData };
      });

      const apiListData = await Promise.all(apiListPromises);
      setApiList(apiListData);
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  const handleCopyToClipboard = (url) => {
    const textField = document.createElement('textarea');
    textField.innerText = url;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  return (
    <div className="api-list">
      {apiList.map((item, index) => (
        <Accordion key={index} className="accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{item.table}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {item.apis.map((api, apiIndex) => (
              <div key={apiIndex} className="api-list__endpoint">
                <div className="api-type">{api.type}</div>
                <div className="api-url">{api.url}</div>
                <Button
                  className="copy-icon"
                  variant="contained"
                  startIcon={<FileCopyIcon />}
                  onClick={() => handleCopyToClipboard(api.url)}
                >
                  Copy
                </Button>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ApiList;
