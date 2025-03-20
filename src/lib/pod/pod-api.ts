export class PodApi {
	static rpcEndpoints = {
		dev: 'https://rpc.dev.pod.network',
		v1: 'https://faucet.rpc.v1.pod.network'
	} as Record<string, string>;

    static faucetEndpoint = {
        dev: ''
    };

	static getRpcEndpoint(version: string) {
		return this.rpcEndpoints[version] || this.rpcEndpoints.dev;
	}
}
