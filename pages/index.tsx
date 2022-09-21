import {ConnectButton} from '@rainbow-me/rainbowkit';
import type {NextPage} from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import {IDXClient} from "../components/ceramic/IDXClient";
import {getSeedFromAddress} from "../components/util";
import {Box, Button, Center, Flex, List, ListItem, Text} from "@chakra-ui/react";
import {Web3Storage} from "web3.storage";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk2YTQzQ0Q0MEUwZkRhODU2Q2JGOUYzN0Y5MkJkNTM2RjRlODAwNzIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTcwODIxMjc0MTAsIm5hbWUiOiJydXN0LXZpZGVvLWJhaXNjIn0.-jf-5qDcA2fbQ66hmNlquxLJ8JdAftrrUEQtftbNsIM"

const idxClient = new IDXClient()
const client = new Web3Storage({token: TOKEN});

const Home: NextPage = () => {

    const {address, isConnecting, isDisconnected, isConnected} = useAccount({
        onConnect({address, connector, isReconnected}) {
            console.log('Connected', {address, connector, isReconnected})
            setRefreshCount(refreshCount + 1)
        },
        onDisconnect() {
            console.log('Disconnected')
        },
    })
    const [did, setDID] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0)
    const [cids,setCIDs] = useState([])
    useEffect(() => {
        if (isConnected) {
            const seed = getSeedFromAddress(address)
            idxClient.getJsDID(seed).then(async (did) => {
                console.log(did)
                // @ts-ignore
                setDID(did)
                await requestData()
            })
        }
    }, [refreshCount])


    const requestData = async ()=>{
        const v = await idxClient.readFiles()
        console.log(v)
        if(v){
            // @ts-ignore
            const cids = v['affiliation'];
            if(cids){
                setCIDs(cids)
            }
        }else{
            setCIDs([])
        }
    }

    const onInputChange = async (event : any) => {
        const selectedFiles = event.target.files;
        if(selectedFiles){
            console.log(selectedFiles)
            const name = selectedFiles[0].name
            const size = selectedFiles[0].size

            const rootCid = await client.put(selectedFiles,{wrapWithDirectory:false});
            console.log("Successfully sent to IPFS");
            console.log("https://" + rootCid + ".ipfs.dweb.link");
            const cid_json = {
                'name':name,
                'size':size,
                'cid':rootCid
            }

            if(cids){
                const result = {
                    'affiliation' : [...cids,cid_json]
                }
                // @ts-ignore
                await idxClient.writeUserInfo(result)
            }else{
                const result = {
                    'affiliation' : [cid_json]
                }
                // @ts-ignore
                await idxClient.writeUserInfo(result)
            }
            await requestData()
        }
    }

    const deleteCid = async (v:any) =>{
        const deleteCid = v.cid;
        // @ts-ignore
        let copyCids = []
        cids.forEach((cidJson)=>{
            const cid = cidJson['cid']
            if( deleteCid != cid){
                copyCids.push(cidJson)
            }
        })
        // @ts-ignore
        console.log(copyCids)
        // @ts-ignore
        const result = {
            'affiliation' : copyCids
        }
        // @ts-ignore
        await idxClient.writeUserInfo(result)
        await requestData()
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <div className={styles.container}>
            <Head>
                <title>DIDStorage</title>
                <meta
                    name="description"
                    content="Generated by @rainbow-me/create-rainbowkit"
                />
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <Flex style={{float: "right", flex: "inherit",}}>
                    <ConnectButton/>
                    {
                        isConnected &&
                        <Button colorScheme='teal' ml={6}>
                            <input type="file"
                                   id="file"
                                   onChange={onInputChange}
                                   style={{display: "none"}}/>
                            <label htmlFor="file">
                                Upload
                            </label>
                        </Button>
                    }
                </Flex>

                {
                    isDisconnected && <h1 className={styles.title}>
                        Please connect <a href="">Wallet </a>{'first '}
                    </h1>
                }
                {
                    isConnected && <h1 className={styles.title}>
                        Welcome to <a href="">IPFS/Filecoin</a> + <a href="">DID</a> +{' '}
                        <a href="https://nextjs.org">DropBox!</a>
                    </h1>
                }

                <div style={{minHeight:"720px"}}>
                    {
                        isConnected && cids &&
                        <Center color='black' mt={'36px'}>
                            <List spacing={3}>
                                <Box w='100%' height={'32px'}>
                                    <Flex color='black'>
                                        <Text fontSize='2xl' w='500px' color={'black'}>
                                            {"File Name"}
                                        </Text>
                                        <Text fontSize='2xl' w='800px'  color={'black'}>
                                            {"cid"}
                                        </Text>

                                        <Text fontSize='2xl'   color={'black'}>
                                            {'action'}
                                        </Text>
                                    </Flex>

                                </Box>
                                {cids.map((reptile) => (
                                    <ListItem w='100%' key={reptile.cid} >
                                        <Flex color='black'>
                                            <Text w='500px' color={'black'}>
                                                {reptile.name}
                                            </Text>
                                            <Text w='800px'  color={'black'}>
                                                {reptile.cid}
                                            </Text>

                                            <Button  onClick={()=>{deleteCid(reptile)}} color={'black'}>
                                                {'delete'}
                                            </Button>
                                        </Flex>

                                    </ListItem>
                                ))}
                            </List>
                        </Center>
                    }
                </div>

            </main>

            <footer className={styles.footer}>
                <a href="https://rainbow.me" target="_blank" rel="noopener noreferrer">
                    Made with ❤️ by your frens at 🌈
                </a>
            </footer>
        </div>
    );
};

export default Home;
