package test;

import org.junit.*;
import org.junit.experimental.ParallelComputer;
import org.junit.runner.JUnitCore;

public class SmokeTest {

	@Test
	public void main(){

		Class[] cls={Smoke.class};  
		JUnitCore.runClasses(ParallelComputer.methods(), cls);  
	}
}
